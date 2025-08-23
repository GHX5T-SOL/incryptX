import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Chart = ({ data }) => {
  // Assume data is array like [{ time: '1', price: 0.01 }, ...]
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="price" stroke="#FF69B4" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
