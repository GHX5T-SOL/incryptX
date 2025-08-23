import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useMockData from '../../hooks/useMockData';
import Input from '../../components/Input';
import Button from '../../components/Button';

const PerpMarket = () => {
  const { id } = useParams();
  const tokens = useMockData('mock-tokens.json');
  const [token, setToken] = useState(null);
  const [leverage, setLeverage] = useState(10);
  const [direction, setDirection] = useState('long');
  const [amount, setAmount] = useState(0);
  const [pnl, setPnl] = useState(0);

  useEffect(() => {
    setToken(tokens.find(t => t.id === id));
    const interval = setInterval(() => setPnl(Math.random() * 100 - 50), 5000);
    return () => clearInterval(interval);
  }, [id, tokens]);

  const handleOpen = () => {
    // Mock
    alert(`Opened ${direction} position at ${leverage}x`);
  };

  if (!token) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1>{token.name} Perp Market</h1>
      <input type="range" min="1" max="100" value={leverage} onChange={e => setLeverage(e.target.value)} />
      <p>Leverage: {leverage}x</p>
      <Button onClick={() => setDirection('long')}>Long</Button>
      <Button onClick={() => setDirection('short')}>Short</Button>
      <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
      <Button onClick={handleOpen}>Open Position</Button>
      <p>Live PNL: {pnl}</p>
    </div>
  );
};

export default PerpMarket;
