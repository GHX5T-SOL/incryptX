import { renderHook, act } from '@testing-library/react';
import { useProfiles } from '../../src/hooks/useProfiles';
import { useSocials } from '../../src/hooks/useSocials';

// Mock Solana wallet adapter
jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: () => ({
    wallet: { publicKey: { toString: () => 'Ghx5t...' } },
    connected: true,
  }),
}));

// Mock the profiles program
jest.mock('../../src/hooks/useAnchorProgram', () => ({
  useProfilesProgram: () => ({
    methods: {
      createProfile: jest.fn().mockResolvedValue({ rpc: jest.fn().mockResolvedValue('profile-tx-signature') }),
      postMessage: jest.fn().mockResolvedValue({ rpc: jest.fn().mockResolvedValue('post-tx-signature') }),
      sendMessage: jest.fn().mockResolvedValue({ rpc: jest.fn().mockResolvedValue('message-tx-signature') }),
      createCommunity: jest.fn().mockResolvedValue({ rpc: jest.fn().mockResolvedValue('community-tx-signature') }),
      joinCommunity: jest.fn().mockResolvedValue({ rpc: jest.fn().mockResolvedValue('join-tx-signature') }),
      postToCommunity: jest.fn().mockResolvedValue({ rpc: jest.fn().mockResolvedValue('community-post-tx-signature') }),
    },
  }),
}));

// Mock fetch for X API calls
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({
    posts: [
      { id: '1', content: 'Test X post', author: 'testuser', timestamp: new Date().toISOString() }
    ]
  })
});

describe('useProfiles', () => {
  it('should create profile successfully', async () => {
    const { result } = renderHook(() => useProfiles());

    await act(async () => {
      const tx = await result.current.createProfile('testuser', 'Test bio');
      expect(tx).toBe('profile-tx-signature');
    });
  });

  it('should post message successfully', async () => {
    const { result } = renderHook(() => useProfiles());

    await act(async () => {
      const tx = await result.current.postMessage('Test message');
      expect(tx).toBe('post-tx-signature');
    });
  });

  it('should send message successfully', async () => {
    const { result } = renderHook(() => useProfiles());

    await act(async () => {
      const tx = await result.current.sendMessage('Test message', 'recipient');
      expect(tx).toBe('message-tx-signature');
    });
  });

  it('should create community successfully', async () => {
    const { result } = renderHook(() => useProfiles());

    await act(async () => {
      const tx = await result.current.createCommunity('Test Community', 'Test description');
      expect(tx).toBe('community-tx-signature');
    });
  });

  it('should join community successfully', async () => {
    const { result } = renderHook(() => useProfiles());

    await act(async () => {
      const tx = await result.current.joinCommunity(1);
      expect(tx).toBe('join-tx-signature');
    });
  });

  it('should post to community successfully', async () => {
    const { result } = renderHook(() => useProfiles());

    await act(async () => {
      const tx = await result.current.postToCommunity(1, 'Test community post');
      expect(tx).toBe('community-post-tx-signature');
    });
  });

  it('should post to X successfully', async () => {
    const { result } = renderHook(() => useProfiles());

    await act(async () => {
      const result = await result.current.postToX('Test X post', 'test-image.jpg');
      expect(result.tx).toBe('mock-tx');
      expect(result.xResult).toEqual({ xResult: 'Mock X post result' });
    });
  });

  it('should scan X posts successfully', async () => {
    const { result } = renderHook(() => useProfiles());

    await act(async () => {
      const result = await result.current.scanXPosts('test query');
      expect(result).toEqual({ xResult: 'Mock X post result' });
    });
  });

  it('should load profiles on mount', async () => {
    const { result } = renderHook(() => useProfiles());

    expect(result.current.profiles).toEqual([
      { id: 1, username: 'ghxst', bio: 'DeFi enthusiast', followers: 1234, posts: 56 },
    ]);
  });

  it('should load chats on mount', async () => {
    const { result } = renderHook(() => useProfiles());

    expect(result.current.chats).toEqual([
      { id: 1, message: 'Hey, how are you?', sender: 'ghxst', timestamp: expect.any(Date) },
      { id: 2, message: 'Good, just staking some tokens!', sender: 'trader123', timestamp: expect.any(Date) },
    ]);
  });

  it('should load communities on mount', async () => {
    const { result } = renderHook(() => useProfiles());

    expect(result.current.communities).toEqual([
      { id: 1, name: 'WIF Warriors', members: 1547, description: 'Elite WIF community', isJoined: true },
      { id: 2, name: 'Meme Masters', members: 892, description: 'Memecoin enthusiasts', isJoined: false },
    ]);
  });
});

describe('useSocials', () => {
  it('should create post with X integration', async () => {
    const { result } = renderHook(() => useSocials());

    await act(async () => {
      const result = await result.current.createPost('Test post', undefined, true);
      expect(result.tx).toBe('post-tx-signature');
      expect(result.xResult).toEqual({ xResult: 'Mock X post result' });
    });
  });

  it('should create chat successfully', async () => {
    const { result } = renderHook(() => useSocials());

    await act(async () => {
      const tx = await result.current.createChat('recipient', 'Hello!');
      expect(tx).toBe('message-tx-signature');
    });
  });

  it('should join or create community', async () => {
    const { result } = renderHook(() => useSocials());

    await act(async () => {
      const result = await result.current.joinOrCreateCommunity('New Community', 'New description');
      expect(result.tx).toBe('community-tx-signature');
    });
  });

  it('should scan for mentions', async () => {
    const { result } = renderHook(() => useSocials());

    await act(async () => {
      const result = await result.current.scanForMentions('incryptx');
      expect(result).toEqual({ xResult: 'Mock X post result' });
    });
  });

  it('should get user stats', () => {
    const { result } = renderHook(() => useSocials());

    const stats = result.current.getUserStats();
    expect(stats).toEqual({
      followers: 1234,
      following: 0,
      posts: 0,
      communities: 1,
    });
  });
});
