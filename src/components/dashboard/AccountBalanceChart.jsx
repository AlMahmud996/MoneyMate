import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#3abff8', '#36d399', '#fbbd23', '#f87272', '#a855f7'];

export default function AccountBalanceChart({ accounts }) {
  const data = accounts.filter((a) => a.balance > 0).map((a) => ({ name: a.name, value: a.balance }));

  if (!data.length) return <p className="text-base-content/60">No account balance to show.</p>;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `৳${value}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}