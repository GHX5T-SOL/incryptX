import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { simulateLaunch } from '../../hooks/useMockAPI';

const CustomLaunch = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ supply: 1000000000, curve: 'linear', vesting: 12, sniperProof: true /* etc */ });

  const handleChange = (key, value) => setFormData({ ...formData, [key]: value });

  const handleSubmit = async () => {
    const result = await simulateLaunch(formData);
    if (result.success) navigate(`/pad/token/${result.id}`);
  };

  return (
    <div className="p-4">
      <h1>Custom Launch - Step {step}</h1>
      {step === 1 && (
        <>
          <Input type="number" placeholder="Supply" value={formData.supply} onChange={e => handleChange('supply', e.target.value)} />
          <select value={formData.curve} onChange={e => handleChange('curve', e.target.value)}>
            <option>linear</option>
            <option>exponential</option>
          </select>
          <Button onClick={() => setStep(2)}>Next</Button>
        </>
      )}
      {step === 2 && (
        <>
          <Input type="number" placeholder="Vesting Months" value={formData.vesting} onChange={e => handleChange('vesting', e.target.value)} />
          <Button onClick={() => setStep(3)}>Next</Button>
          <Button onClick={() => setStep(1)}>Back</Button>
        </>
      )}
      {step === 3 && (
        <>
          <label>Sniper Proof <input type="checkbox" checked={formData.sniperProof} onChange={e => handleChange('sniperProof', e.target.checked)} /></label>
          {/* More toggles */}
          <Button onClick={handleSubmit}>Deploy</Button>
          <Button onClick={() => setStep(2)}>Back</Button>
        </>
      )}
    </div>
  );
};

export default CustomLaunch;
