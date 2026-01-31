import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * Dummy data 
 */
const data = [
  { name: "Mon", orders: 120 },
  { name: "Tue", orders: 210 },
  { name: "Wed", orders: 180 },
  { name: "Thu", orders: 260 },
  { name: "Fri", orders: 300 },
  { name: "Sat", orders: 220 },
  { name: "Sun", orders: 190 },
];

const OrdersChart = () => {
  return (
    <ResponsiveContainer width="100%" height={190}>
      <LineChart data={data}>
        <XAxis dataKey="name" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip
          contentStyle={{
            background: "#ffffff",
            borderRadius: "10px",
            border: "none",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
        />
        <Line
          type="monotone"
          dataKey="orders"
          stroke="#0f766e"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default OrdersChart;
