import { useState } from 'react';
import useMockData from '../../hooks/useMockData';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Confetti from 'react-confetti';

const TradeHome = () => {
  const tokens = useMockData('mock-tokens.json');
  const [fromToken, setFromToken] = useState(tokens[0]?.id);
  const [toToken, setToToken] = useState(tokens[1]?.id);
  const [amount, setAmount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSwap = () => {
    // Simulate
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="p-4">
      <h1>Simple Swap</h1>
      <select value={fromToken} onChange={e => setFromToken(e.target.value)}>
        {tokens.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
      <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
      <select value={toToken} onChange={e => setToToken(e.target.value)}>
        {tokens.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
      <p>Slippage: 0.5% (mock)</p>
      <Button onClick={handleSwap}>Swap</Button>
      {showConfetti && <Confetti />}
    </div>
  );
};

export default TradeHome;
