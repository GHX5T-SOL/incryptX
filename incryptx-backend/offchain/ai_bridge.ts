import { spawn } from 'child_process';
import path from 'path';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';

type AIGenResult = {
  name: string;
  ticker: string;
  description?: string;
  path?: string;
  ipfs?: string | null;
};

function sanitize(input: string): string {
  return input.replace(/[\r\n\t]/g, ' ').slice(0, 500);
}

export async function call_ai_generate(mode: 'prompt' | 'x' | 'logo', inputVal: string): Promise<AIGenResult> {
  return new Promise<AIGenResult>((resolve, reject) => {
    const safeMode = mode;
    const safeInput = sanitize(inputVal);

    const pyPath = path.resolve('/Users/mx/incryptX-1/incryptx-backend/ai/ai_generate.py');
    const venvPython = path.resolve('/Users/mx/incryptX-1/incryptx-backend/venv/bin/python');

    const args = [pyPath, '--mode', safeMode, '--input', safeInput];
    const child = spawn(venvPython, args, { stdio: ['ignore', 'pipe', 'pipe'] });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d.toString()))
    child.stderr.on('data', (d) => (stderr += d.toString()))
    child.on('error', (err) => reject(err));
    child.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`ai_generate exited with code ${code}: ${stderr}`));
      }
      try {
        const jsonStart = stdout.indexOf('{');
        const parsed = JSON.parse(jsonStart >= 0 ? stdout.slice(jsonStart) : stdout);
        resolve(parsed);
      } catch (e) {
        reject(new Error(`Failed to parse ai_generate output: ${e}\nSTDOUT:${stdout}\nSTDERR:${stderr}`));
      }
    });
  });
}

export async function check_anti_vamp(promptOrText: string, logoPath?: string): Promise<boolean> {
  // For now, call CLIP routine indirectly by reusing logo mode and demo flag for similarity; simple stub
  // True means potential duplicate detected
  if (!logoPath) return false;
  return new Promise<boolean>((resolve, reject) => {
    const pyPath = path.resolve('/Users/mx/incryptX-1/incryptx-backend/ai/ai_generate.py');
    const venvPython = path.resolve('/Users/mx/incryptX-1/incryptx-backend/venv/bin/python');
    const args = [pyPath, '--mode', 'logo', '--input', sanitize(promptOrText), '--anti_vamp_demo'];
    const child = spawn(venvPython, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d.toString()))
    child.stderr.on('data', (d) => (stderr += d.toString()))
    child.on('error', (err) => reject(err));
    child.on('close', (code) => {
      if (code !== 0) return reject(new Error(`anti_vamp check failed: ${stderr}`));
      try {
        const lines = stdout.trim().split(/\n+/);
        const last = lines[lines.length - 1];
        const obj = JSON.parse(last);
        resolve(!!obj.anti_vamp_possible_duplicate);
      } catch (e) {
        // If parsing fails, default to safe side false (no block) in dev
        resolve(false);
      }
    });
  });
}

export async function invoke_launch(
  provider: anchor.AnchorProvider,
  program: anchor.Program,
  args: {
    poolSeed: anchor.BN;
    name: string;
    symbol: string;
    uri: string;
    basePriceLamports: anchor.BN;
    slopeNum: anchor.BN;
    slopeDen: anchor.BN;
    migrateThresholdLamports: anchor.BN;
  }
): Promise<string> {
  const wallet = provider.wallet as anchor.Wallet;

  const [poolPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('pool'), wallet.publicKey.toBuffer(), args.poolSeed.toArrayLike(Buffer, 'le', 8)],
    program.programId
  );
  const [mintPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('mint'), poolPda.toBuffer()],
    program.programId
  );

  const sys = SystemProgram.programId;
  const tokenProgram = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
  const rent = new PublicKey('SysvarRent111111111111111111111111111111111');

  const txSig = await (program as any).methods
    .initPool(
      args.poolSeed,
      args.name,
      args.symbol,
      args.uri,
      args.basePriceLamports,
      args.slopeNum,
      args.slopeDen,
      args.migrateThresholdLamports
    )
    .accounts({
      authority: wallet.publicKey,
      pool: poolPda,
      mint: mintPda,
      metadata: PublicKey.default,
      systemProgram: sys,
      tokenProgram,
      rent,
    })
    .rpc();

  return txSig;
}

export async function launch_memecoin(
  provider: anchor.AnchorProvider,
  program: anchor.Program,
  opts: { mode: 'prompt' | 'x'; input: string; basePriceLamports?: number }
): Promise<{ tx: string; ai: AIGenResult }>
{
  const ai = await call_ai_generate(opts.mode, opts.input);
  const dup = await check_anti_vamp(`${ai.name} ${ai.ticker}`, undefined);
  if (dup) throw new Error('Potential duplicate detected by anti-vamp check');

  const poolSeed = new anchor.BN(Date.now() % 2 ** 32);
  const tx = await invoke_launch(provider, program, {
    poolSeed,
    name: ai.name,
    symbol: ai.ticker,
    uri: ai.ipfs || 'ipfs://',
    basePriceLamports: new anchor.BN(opts.basePriceLamports ?? 1),
    slopeNum: new anchor.BN(1),
    slopeDen: new anchor.BN(1),
    migrateThresholdLamports: new anchor.BN(1_000_000),
  });
  return { tx, ai };
}
