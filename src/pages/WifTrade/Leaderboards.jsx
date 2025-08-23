import { useState } from 'react';
import { Link } from 'react-router-dom';
import useMockData from '../../hooks/useMockData';

const Leaderboards = () => {
  const users = useMockData('mock-users.json');
  const [sortBy, setSortBy] = useState('repScore');

  const sortedUsers = [...users].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <div className="p-4">
      <h1>Leaderboards</h1>
      <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
        <option value="repScore">Rep Score</option>
        <option value="totalVolume">Volume</option> {/* Assume field */}
      </select>
      <table className="w-full">
        <thead><tr><th>Username</th><th>Score</th></tr></thead>
        <tbody>
          {sortedUsers.slice(0,50).map(user => (
            <tr key={user.username}>
              <td><Link to={`/social/profile/${user.username}`}>{user.username}</Link></td>
              <td>{user[sortBy]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboards;
