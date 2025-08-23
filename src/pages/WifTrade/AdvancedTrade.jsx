import { useState } from 'react';
import Chart from '../../components/Chart';
import Input from '../../components/Input';
import Button from '../../components/Button';

const mockOrders = [{ price: 0.01, amount: 1000 }, /* more */];

const AdvancedTrade = () => {
  const mockChartData = [/* data */];
  const [orderType, setOrderType] = useState('limit');
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0);

  const handlePlace = () => {
    // Mock
    alert('Order placed');
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Chart data={mockChartData} />
      <div>
        <h2>Order Book</h2>
        <table className="w-full">
          <thead><tr><th>Price</th><th>Amount</th></tr></thead>
          <tbody>{mockOrders.map((o, i) => <tr key={i}><td>{o.price}</td><td>{o.amount}</td></tr>)}</tbody>
        </table>
      </div>
      <div>
        <select value={orderType} onChange={e => setOrderType(e.target.value)}>
          <option>limit</option>
          <option>stop</option>
          <option>snipe</option>
        </select>
        <Input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
        <Input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
        <Button onClick={handlePlace}>Place Order</Button>
      </div>
    </div>
  );
};

export default AdvancedTrade;
