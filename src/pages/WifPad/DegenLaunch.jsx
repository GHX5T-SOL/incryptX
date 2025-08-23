import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { simulateLaunch } from '../../hooks/useMockAPI';
import { generateTokenName } from '../../utils/mockGenerators';

const DegenLaunch = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [image, setImage] = useState('');
  const [initialBuy, setInitialBuy] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSuggest = () => setName(generateTokenName());

  const handleSubmit = async () => {
    setLoading(true);
    const result = await simulateLaunch({ name, symbol, image, initialBuy });
    setLoading(false);
    if (result.success) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        navigate(`/pad/token/${result.id}`);
      }, 3000);
    }
  };

  return (
    <div className="p-4">
      <h1>Degen Launch</h1>
      <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <Button onClick={handleSuggest}>AI Suggest</Button>
      <Input placeholder="Symbol" value={symbol} onChange={e => setSymbol(e.target.value)} />
      <input type="file" onChange={e => setImage(URL.createObjectURL(e.target.files[0]))} />
      {image && <img src={image} alt="preview" className="w-48" />}
      <input type="range" min="0" max="100" value={initialBuy} onChange={e => setInitialBuy(e.target.value)} />
      <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Launching...' : 'Deploy'}</Button>
      {showConfetti && <Confetti />}
    </div>
  );
};

export default DegenLaunch;
