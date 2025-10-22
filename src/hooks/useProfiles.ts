import { useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useProfilesProgram } from './useAnchorProgram';

// Browser-compatible Python call simulation for X integration
const execAsync = async (command: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.stringify({ xResult: 'Mock X post result' }));
    }, 1000);
  });
};

export const useProfiles = () => {
  const { wallet } = useWallet();
  const profilesProgram = useProfilesProgram({}); // Placeholder IDL
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [chats, setChats] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);

  useEffect(() => {
    if (wallet?.publicKey) {
      loadProfiles();
      loadPosts();
      loadChats();
      loadCommunities();
    }
  }, [wallet?.publicKey]);

  const loadProfiles = async () => {
    if (!wallet?.publicKey) return;

    try {
      // Mock data for now - replace with actual program call
      setProfiles([
        { id: 1, username: 'ghxst', bio: 'DeFi enthusiast', followers: 1234, posts: 56 },
      ]);
    } catch (error) {
      console.error('Error loading profiles:', error);
      setProfiles([]);
    }
  };

  const createProfile = async (username: string, bio: string) => {
    if (!wallet || !profilesProgram) throw new Error('Wallet or program not available');

    setLoading(true);
    try {
      const tx = await profilesProgram.methods.createProfile(username, bio).accounts({
        user: wallet.publicKey,
      }).rpc();

      await loadProfiles();
      return tx;
    } catch (error) {
      console.error('Create profile failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getProfiles = async () => {
    await loadProfiles();
    return profiles;
  };

  const postMessage = async (content: string) => {
    if (!wallet || !profilesProgram) throw new Error('Wallet or program not available');

    setLoading(true);
    try {
      const tx = await profilesProgram.methods.postMessage(content).accounts({
        user: wallet.publicKey,
      }).rpc();

      await loadPosts();
      return tx;
    } catch (error) {
      console.error('Post message failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      setPosts([
        { id: 1, content: 'Just launched a new token! 🚀', author: 'ghxst', timestamp: new Date() },
        { id: 2, content: 'Great trading day today! 📈', author: 'trader123', timestamp: new Date() },
      ]);
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([]);
    }
  };

  const loadChats = async () => {
    try {
      setChats([
        { id: 1, message: 'Hey, how are you?', sender: 'ghxst', timestamp: new Date() },
        { id: 2, message: 'Good, just staking some tokens!', sender: 'trader123', timestamp: new Date() },
      ]);
    } catch (error) {
      console.error('Error loading chats:', error);
      setChats([]);
    }
  };

  const sendMessage = async (content: string, recipient: string) => {
    if (!wallet || !profilesProgram) throw new Error('Wallet or program not available');

    setLoading(true);
    try {
      const tx = await profilesProgram.methods.sendMessage(content, recipient).accounts({
        user: wallet.publicKey,
      }).rpc();

      await loadChats();
      return tx;
    } catch (error) {
      console.error('Send message failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadCommunities = async () => {
    try {
      setCommunities([
        { id: 1, name: 'WIF Warriors', members: 1547, description: 'Elite WIF community', isJoined: true },
        { id: 2, name: 'Meme Masters', members: 892, description: 'Memecoin enthusiasts', isJoined: false },
      ]);
    } catch (error) {
      console.error('Error loading communities:', error);
      setCommunities([]);
    }
  };

  const createCommunity = async (name: string, description: string) => {
    if (!wallet || !profilesProgram) throw new Error('Wallet or program not available');

    setLoading(true);
    try {
      const tx = await profilesProgram.methods.createCommunity(name, description).accounts({
        user: wallet.publicKey,
      }).rpc();

      await loadCommunities();
      return tx;
    } catch (error) {
      console.error('Create community failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const joinCommunity = async (communityId: number) => {
    if (!wallet || !profilesProgram) throw new Error('Wallet or program not available');

    setLoading(true);
    try {
      const tx = await profilesProgram.methods.joinCommunity(communityId).accounts({
        user: wallet.publicKey,
      }).rpc();

      await loadCommunities();
      return tx;
    } catch (error) {
      console.error('Join community failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const postToCommunity = async (communityId: number, content: string) => {
    if (!wallet || !profilesProgram) throw new Error('Wallet or program not available');

    setLoading(true);
    try {
      const tx = await profilesProgram.methods.postToCommunity(communityId, content).accounts({
        user: wallet.publicKey,
      }).rpc();

      await loadCommunityPosts(communityId);
      return tx;
    } catch (error) {
      console.error('Post to community failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadCommunityPosts = async (communityId: number) => {
    try {
      setCommunityPosts([
        { id: 1, content: 'Welcome to WIF Warriors!', author: 'admin', timestamp: new Date(), communityId },
        { id: 2, content: 'Just launched a new WIF token!', author: 'user1', timestamp: new Date(), communityId },
      ]);
    } catch (error) {
      console.error('Error loading community posts:', error);
      setCommunityPosts([]);
    }
  };

  const postToX = async (content: string, imageUrl?: string) => {
    if (!wallet) throw new Error('Wallet not connected');

    setLoading(true);
    try {
      // Simulate Python call for X posting
      const xResponse = await execAsync(`python socials/socials.py --action post --content "${content}" --image "${imageUrl || ''}"`);
      console.log('X post result:', xResponse);

      // Also post to on-chain feed
      await postMessage(content);

      return { xResult: JSON.parse(xResponse as string), tx: 'mock-tx' };
    } catch (error) {
      console.error('Post to X failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const scanXPosts = async (query: string) => {
    setLoading(true);
    try {
      // Simulate Python call for X scanning
      const xResponse = await execAsync(`python socials/socials.py --action scan --query "${query}"`);
      console.log('X scan result:', xResponse);

      return JSON.parse(xResponse as string);
    } catch (error) {
      console.error('Scan X posts failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProfile,
    getProfiles,
    postMessage,
    sendMessage,
    createCommunity,
    joinCommunity,
    postToCommunity,
    loadCommunityPosts,
    postToX,
    scanXPosts,
    profiles,
    posts,
    chats,
    communities,
    communityPosts,
    loading,
  };
};
