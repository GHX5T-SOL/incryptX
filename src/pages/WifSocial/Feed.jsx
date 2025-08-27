import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FireIcon, 
  HeartIcon,
  ChatBubbleLeftIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  UserCircleIcon,
  StarIcon,
  EyeIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import useMockData from '../../hooks/useMockData';

const Feed = () => {
  const users = useMockData('mock-users.json');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showCreatePost, setShowCreatePost] = useState(false);

  const filters = [
    { id: 'all', name: 'All Posts', count: 200 },
    { id: 'trending', name: '🔥 Trending', count: 45 },
    { id: 'following', name: '👥 Following', count: 67 },
    { id: 'launches', name: '🚀 Launches', count: 23 },
    { id: 'trading', name: '💹 Trading', count: 34 }
  ];

  useEffect(() => {
    // Only generate posts when users data is available
    if (!users || users.length === 0) return;
    
    // Generate mock posts
    const mockPosts = Array.from({ length: 50 }, (_, index) => {
      const user = users[Math.floor(Math.random() * users.length)];
      const postTypes = ['text', 'image', 'launch', 'trade', 'meme'];
      const postType = postTypes[Math.floor(Math.random() * postTypes.length)];
      
      let content = '';
      let image = null;
      let tags = [];
      
      switch (postType) {
        case 'text':
          content = [
            "Just discovered the most amazing memecoin! 🚀",
            "IncryptX ecosystem is absolutely crushing it today! 💪",
            "Who else is hyped about the new launchpad features?",
            "Trading has never been this smooth on Solana!",
            "Community is everything in crypto! Love you all! ❤️",
            "Just made my first 100x trade! Feeling blessed! 🙏",
            "The future of DeFi is here and it's WIF!",
            "Can't believe how fast this ecosystem is growing!",
            "Remember: diamond hands win! 💎🙌",
            "Today's gains are tomorrow's dreams! 🌙"
          ][Math.floor(Math.random() * 10)];
          break;
        case 'image':
          content = "Check out this amazing artwork! 🎨";
          image = "/assets/images/placeholder-meme.svg";
          break;
        case 'launch':
          content = `Just launched ${['CatWifHat', 'DogWifLaser', 'BunnyWifHat', 'PandaWifHat'][Math.floor(Math.random() * 4)]}! 🚀`;
          tags = ['#launch', '#memecoin', '#WIF'];
          break;
        case 'trade':
          content = `Made a ${Math.random() > 0.5 ? 'profitable' : 'strategic'} trade on ${['CatWifHat', 'DogWifLaser', 'BunnyWifHat'][Math.floor(Math.random() * 3)]}! 📈`;
          tags = ['#trading', '#profit', '#WIF'];
          break;
        case 'meme':
          content = "This meme perfectly describes today's market! 😂";
          image = "/assets/images/placeholder-meme.svg";
          tags = ['#meme', '#funny', '#crypto'];
          break;
      }

      return {
        id: index + 1,
        user: user,
        content,
        image,
        tags,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        likes: Math.floor(Math.random() * 1000) + 10,
        replies: Math.floor(Math.random() * 100) + 1,
        reposts: Math.floor(Math.random() * 50) + 1,
        views: Math.floor(Math.random() * 10000) + 100,
        isLiked: Math.random() > 0.7,
        isReposted: Math.random() > 0.8,
        type: postType
      };
    });

    setPosts(mockPosts);
  }, [users]);

  const handleLike = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  const handleRepost = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, reposts: post.isReposted ? post.reposts - 1 : post.reposts + 1, isReposted: !post.isReposted }
        : post
    ));
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) return;
    
    const newPostObj = {
      id: posts.length + 1,
      user: users[0], // Current user
      content: newPost,
      image: null,
      tags: newPost.match(/#\w+/g) || [],
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: 0,
      reposts: 0,
      views: 0,
      isLiked: false,
      isReposted: false,
      type: 'text'
    };
    
    setPosts([newPostObj, ...posts]);
    setNewPost('');
    setShowCreatePost(false);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffMs = now - postTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return postTime.toLocaleDateString();
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Social</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Connect, share, and discover the latest in the IncryptX universe
          </p>
        </motion.div>

        {/* Create Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's happening in the IncryptX universe?"
                className="input-modern w-full resize-none"
                rows={3}
              />
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <PhotoIcon className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <FireIcon className="w-5 h-5 text-orange-500" />
                  </button>
                </div>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.trim()}
                  className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass-card p-4 mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedFilter === filter.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {filter.name} ({filter.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Posts Feed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="glass-card glass-card-hover p-6"
            >
              {/* Post Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{post.user.username.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white">@{post.user.username}</span>
                    {post.type === 'launch' && (
                      <span className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full">
                        🚀 Launch
                      </span>
                    )}
                    {post.type === 'trade' && (
                      <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs rounded-full">
                        💹 Trade
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-400">{formatTime(post.timestamp)}</span>
                </div>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <ShareIcon className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-white text-lg leading-relaxed mb-3">{post.content}</p>
                
                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-primary-pink hover:text-pink-400 cursor-pointer">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Image */}
                {post.image && (
                  <div className="rounded-lg overflow-hidden mb-3">
                    <img src={post.image} alt="Post" className="w-full h-64 object-cover" />
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {/* Like */}
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      post.isLiked ? 'text-red-500 bg-red-500/20' : 'text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <HeartIcon className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm">{post.likes.toLocaleString()}</span>
                  </button>

                  {/* Reply */}
                  <button className="flex items-center gap-2 p-2 text-gray-400 hover:bg-white/10 rounded-lg transition-colors">
                    <ChatBubbleLeftIcon className="w-5 h-5" />
                    <span className="text-sm">{post.replies.toLocaleString()}</span>
                  </button>

                  {/* Repost */}
                  <button
                    onClick={() => handleRepost(post.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      post.isReposted ? 'text-green-500 bg-green-500/20' : 'text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <ArrowPathIcon className={`w-5 h-5 ${post.isReposted ? 'fill-current' : ''}`} />
                    <span className="text-sm">{post.reposts.toLocaleString()}</span>
                  </button>

                  {/* Views */}
                  <div className="flex items-center gap-2 p-2 text-gray-400">
                    <EyeIcon className="w-5 h-5" />
                    <span className="text-sm">{post.views.toLocaleString()}</span>
                  </div>
                </div>

                {/* User Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-4 h-4 text-yellow-500" />
                    <span>{post.user.repScore}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🎩</span>
                    <span>{post.user.nftHats.length}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="btn-secondary px-8 py-3">
            Load More Posts
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Feed;
