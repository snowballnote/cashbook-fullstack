// components/UserSignupChart.tsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

type Props = {
  data: { date: string; count: number }[];
};

export default function UserSignupChart({ data }: Props) {
  const labels = data.map(d => d.date.slice(5)); // MM-dd
  const counts = data.map(d => d.count);

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: "가입자 수",
            data: counts,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
        },
      }}
    />
  );
}
