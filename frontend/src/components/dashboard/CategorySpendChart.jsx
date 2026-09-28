import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#36d399', '#3abff8', '#fbbd23', '#f87272', '#a855f7', '#f472b6', '#22d3ee', '#84cc16'];

export default function CategorySpendChart({ categorySpend }) {
  const data = categorySpend.filter((c) => c.spent > 0).map((c) => ({ name: c.name, value: c.spent }));

  if (!data.length) return <p className="text-base-content/60">No spending yet.</p>;

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