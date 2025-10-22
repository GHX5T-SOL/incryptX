import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useProfiles } from './useProfiles';

// Browser-compatible Python call simulation for X integration
const execAsync = async (command: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.stringify({ xResult: 'Mock X post result' }));
    }, 1000);
  });
};

export const useSocials = () => {
  const { wallet } = useWallet();
  const {
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
  } = useProfiles();

  const [xPosts, setXPosts] = useState([]);
  const [socialLoading, setSocialLoading] = useState(false);

  const getFeed = async () => {
    // Combine on-chain posts with X posts
    const combinedFeed = [
      ...posts,
      ...xPosts,
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return combinedFeed;
  };

  const createPost = async (content: string, imageUrl?: string, postToXFlag = false) => {
    if (!wallet) throw new Error('Wallet not connected');

    setSocialLoading(true);
    try {
      let result = {};

      // Post to on-chain feed
      const tx = await postMessage(content);
      result = { ...result, tx };

      // Post to X if requested
      if (postToXFlag) {
        const xResult = await postToX(content, imageUrl);
        result = { ...result, xResult };
      }

      return result;
    } catch (error) {
      console.error('Create post failed:', error);
      throw error;
    } finally {
      setSocialLoading(false);
    }
  };

  const createChat = async (recipient: string, initialMessage: string) => {
    if (!wallet) throw new Error('Wallet not connected');

    setSocialLoading(true);
    try {
      const tx = await sendMessage(initialMessage, recipient);
      return tx;
    } catch (error) {
      console.error('Create chat failed:', error);
      throw error;
    } finally {
      setSocialLoading(false);
    }
  };

  const joinOrCreateCommunity = async (name: string, description: string) => {
    if (!wallet) throw new Error('Wallet not connected');

    setSocialLoading(true);
    try {
      // Check if community already exists
      const existingCommunity = communities.find(c => c.name.toLowerCase() === name.toLowerCase());

      if (existingCommunity) {
        if (!existingCommunity.isJoined) {
          await joinCommunity(existingCommunity.id);
        }
        return existingCommunity;
      } else {
        const tx = await createCommunity(name, description);
        return { tx, newCommunity: true };
      }
    } catch (error) {
      console.error('Join or create community failed:', error);
      throw error;
    } finally {
      setSocialLoading(false);
    }
  };

  const scanForMentions = async (username: string) => {
    setSocialLoading(true);
    try {
      const scanResult = await scanXPosts(`@${username}`);
      setXPosts(scanResult.posts || []);
      return scanResult;
    } catch (error) {
      console.error('Scan for mentions failed:', error);
      throw error;
    } finally {
      setSocialLoading(false);
    }
  };

  const getUserStats = () => {
    const userProfile = profiles[0]; // Assuming first profile is current user
    if (!userProfile) return null;

    return {
      followers: userProfile.followers || 0,
      following: userProfile.following || 0,
      posts: posts.length,
      communities: communities.filter(c => c.isJoined).length,
    };
  };

  return {
    // Profile functions
    createProfile,
    getProfiles,
    profiles,

    // Post functions
    createPost,
    postMessage,
    postToCommunity,
    getFeed,
    posts,

    // Chat functions
    sendMessage,
    createChat,
    chats,

    // Community functions
    createCommunity,
    joinCommunity,
    joinOrCreateCommunity,
    loadCommunityPosts,
    communities,
    communityPosts,

    // X integration
    postToX,
    scanXPosts,
    scanForMentions,
    xPosts,

    // Utility functions
    getUserStats,

    // Loading states
    loading,
    socialLoading: socialLoading || loading,
  };
};
