import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Chart from '../../components/Chart';
import useMockData from '../../hooks/useMockData';
import Input from '../../components/Input';
import Button from '../../components/Button';

const TokenDetails = () => {
  const { id } = useParams();
  const tokens = useMockData('mock-tokens.json');
  const [token, setToken] = useState(null);
  const [tab, setTab] = useState('info');
  const [stakeAmount, setStakeAmount] = useState(0);

  useEffect(() => {
    setToken(tokens.find(t => t.id === id));
  }, [id, tokens]);

  if (!token) return <div>Loading...</div>;

  const mockChartData = [{ time: '1', price: 0.01 }, { time: '2', price: 0.02 } /* more */];

  return (
    <div className="p-4">
      <h1>{token.name}</h1>
      <div className="flex space-x-4">
        <button onClick={() => setTab('info')}>Info</button>
        <button onClick={() => setTab('staking')}>Staking</button>
        <button onClick={() => setTab('migration')}>Migration</button>
      </div>
      {tab === 'info' && (
        <>
          <p>MC: ${token.mc}</p>
          <p>Holders: {token.holders}</p>
          <Chart data={mockChartData} />
        </>
      )}
      {tab === 'staking' && (
        <>
          <Input type="number" value={stakeAmount} onChange={e => setStakeAmount(e.target.value)} placeholder="Amount to stake" />
          <Button onClick={() => alert('Staked!')}>Stake</Button>
        </>
      )}
      {tab === 'migration' && (
        <>
          <input type="range" min="0" max="100" /> {/* Sliders for DEX splits */}
          <Button onClick={() => alert('Migrated!')}>Migrate</Button>
        </>
      )}
    </div>
  );
};

export default TokenDetails;
