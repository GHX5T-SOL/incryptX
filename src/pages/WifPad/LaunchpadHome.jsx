import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TokenCard from '../../components/TokenCard';
import useMockData from '../../hooks/useMockData';

const LaunchpadHome = () => {
  const tokens = useMockData('mock-tokens.json');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('recent');

  const filteredTokens = tokens.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  const sortedTokens = tab === 'recent' ? filteredTokens : filteredTokens.sort((a, b) => b.mc - a.mc);

  return (
    <div className="p-4">
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tokens..." className="w-full p-2 border rounded" />
      <div className="flex space-x-4 mt-4">
        <button onClick={() => setTab('recent')} className={tab === 'recent' ? 'font-bold' : ''}>Recent</button>
        <button onClick={() => setTab('trending')} className={tab === 'trending' ? 'font-bold' : ''}>Trending</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {sortedTokens.map(token => <TokenCard key={token.id} token={token} />)}
      </div>
      <Link to="/pad/launch/degen">Degen Launch</Link>
      <Link to="/pad/launch/custom">Custom Launch</Link>
    </div>
  );
};

export default LaunchpadHome;
