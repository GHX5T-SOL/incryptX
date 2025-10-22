import { call_ai_generate } from '../ai_bridge';
import { spawn } from 'child_process';

jest.mock('child_process', () => {
  const events: any = {};
  return {
    spawn: jest.fn(() => {
      const stdoutHandlers: any[] = [];
      const stderrHandlers: any[] = [];
      return {
        stdout: { on: (_: string, fn: any) => stdoutHandlers.push(fn) },
        stderr: { on: (_: string, fn: any) => stderrHandlers.push(fn) },
        on: (event: string, fn: any) => (events[event] = fn),
        __emit: (code = 0) => {
          stdoutHandlers.forEach((fn) => fn(Buffer.from('{"name":"X","ticker":"XXX"}')));
          events['close'] && events['close'](code);
        },
      } as any;
    }),
  };
});

describe('offchain ai bridge', () => {
  it('parses JSON from ai_generate output', async () => {
    const promise = call_ai_generate('prompt', 'test');
    const proc = (spawn as jest.Mock).mock.results[0].value;
    proc.__emit(0);
    const res = await promise;
    expect(res.ticker).toBe('XXX');
  });

  it('handles non-zero exit', async () => {
    const promise = call_ai_generate('prompt', 'bad');
    const proc = (spawn as jest.Mock).mock.results[1].value;
    proc.__emit(1);
    await expect(promise).rejects.toThrow();
  });
});
