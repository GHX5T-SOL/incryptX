import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TokenCard from '../components/TokenCard';
import Post from '../components/Post';
import useMockData from '../hooks/useMockData';
import { useMockWallet } from '../hooks/useMockWallet';

const Dashboard = () => {
  const { address } = useMockWallet();
  const tokens = useMockData('mock-tokens.json');
  const trades = useMockData('mock-trades.json');
  const posts = useMockData('mock-posts.json');

  const [myTokens, setMyTokens] = useState([]);
  useEffect(() => {
    // Mock filter for user's tokens
    setMyTokens(tokens.filter(t => t.holders > 100)); // Placeholder
  }, [tokens]);

  if (!address) return <div className="text-center p-8">Connect wallet to view dashboard</div>;

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <section>
        <h2>My Tokens</h2>
        {myTokens.map(token => <TokenCard key={token.id} token={token} />)}
        <Link to="/pad/my-launches">View All</Link>
      </section>
      <section>
        <h2>Recent Trades</h2>
        <ul>
          {trades.slice(0,5).map(trade => <li key={trade.id}>{trade.type} {trade.amount} of {trade.token} at ${trade.price}</li>)}
        </ul>
        <Link to="/trade">View All</Link>
      </section>
      <section>
        <h2>Social Snippets</h2>
        {posts.slice(0,5).map(post => <Post key={post.id} post={post} />)}
        <Link to="/social/feed">View Feed</Link>
      </section>
    </div>
  );
};

export default Dashboard;
