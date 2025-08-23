import { useState } from 'react';
import { motion } from 'framer-motion';

const Post = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleLike = () => setLikes(likes + 1);
  const handleReply = () => {
    // Mock add reply
    post.replies.push({ user: 'CurrentUser', text: replyText });
    setReplyText('');
    setShowReplies(true);
  };

  return (
    <motion.div className="bg-dog-white p-4 rounded-lg mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex">
        <img src={post.userPic} alt={post.user} className="w-12 h-12 rounded-full" /> {/* Assume userPic from mock */}
        <div>
          <h4>{post.user}</h4>
          <p>{post.text}</p>
          {post.image && <img src={post.image} alt="post" className="max-w-md" />}
        </div>
      </div>
      <div className="flex space-x-4 mt-2">
        <button onClick={handleLike}>Like ({likes})</button>
        <button onClick={() => setShowReplies(!showReplies)}>Reply ({post.replies.length})</button>
        <button>Repost</button>
      </div>
      {showReplies && (
        <div>
          {post.replies.map((reply, i) => <p key={i}><strong>{reply.user}:</strong> {reply.text}</p>)}
          <input value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Reply..." />
          <button onClick={handleReply}>Send</button>
        </div>
      )}
    </motion.div>
  );
};

export default Post;
