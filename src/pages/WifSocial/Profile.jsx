import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useMockData from '../../hooks/useMockData';
import Post from '../../components/Post';
import Modal from '../../components/Modal';
import Button from '../../components/Button';

const Profile = () => {
  const { username } = useParams();
  const users = useMockData('mock-users.json');
  const posts = useMockData('mock-posts.json');
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('posts');
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    setUser(users.find(u => u.username === username));
  }, [username, users]);

  const userPosts = posts.filter(p => p.user === username);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex">
        <img src={user.pic} alt={user.username} className="w-24 h-24 rounded-full" />
        <div>
          <h1>{user.username}</h1>
          <Button onClick={() => setEditOpen(true)}>Edit</Button>
        </div>
      </div>
      <progress value={user.repScore} max="100" />
      <div className="flex space-x-4">
        <button onClick={() => setTab('posts')}>Posts</button>
        <button onClick={() => setTab('hats')}>NFT Hats</button>
        <button onClick={() => setTab('stats')}>Stats</button>
      </div>
      {tab === 'posts' && userPosts.map(post => <Post key={post.id} post={post} />)}
      {tab === 'hats' && <div className="grid grid-cols-3 gap-2">{user.nftHats.map(hat => <img key={hat} src={`/assets/images/nft-hats/${hat}`} />)}</div>}
      {tab === 'stats' && <p>Launches: {user.launches.length}</p>}
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <h2>Edit Profile</h2>
        {/* Edit form */}
        <Button>Save</Button>
      </Modal>
    </div>
  );
};

export default Profile;
