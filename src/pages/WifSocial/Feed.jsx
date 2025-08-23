import { useState, useEffect } from 'react';
import Post from '../../components/Post';
import useMockData from '../../hooks/useMockData';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { motion } from 'framer-motion';

const Feed = () => {
  const [posts, setPosts] = useState(useMockData('mock-posts.json'));
  const [newPost, setNewPost] = useState('');
  const [filter, setFilter] = useState('global');
  const [page, setPage] = useState(1);

  const handlePost = () => {
    setPosts([{ id: Math.random(), user: 'CurrentUser', text: newPost, likes: 0, replies: [] }, ...posts]);
    setNewPost('');
  };

  const loadMore = () => setPage(page + 1);

  // Mock filter
  const filteredPosts = posts; // Implement actual filter

  return (
    <div className="p-4">
      <select value={filter} onChange={e => setFilter(e.target.value)}>
        <option>Global</option>
        <option>My Follows</option>
        <option>Project</option>
      </select>
      <Input placeholder="What's happening?" value={newPost} onChange={e => setNewPost(e.target.value)} />
      <Button onClick={handlePost}>Post</Button>
      {filteredPosts.slice(0, page * 10).map(post => (
        <motion.div key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Post post={post} />
        </motion.div>
      ))}
      <Button onClick={loadMore}>Load More</Button>
    </div>
  );
};

export default Feed;
