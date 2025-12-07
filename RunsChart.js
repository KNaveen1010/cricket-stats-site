import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default function RunsChart({ data }) {
  const labels = (data || []).map((m) => m.match || '');
  const runs = (data || []).map((m) => m.runs || 0);
  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label: 'Runs',
            data: runs,
          },
        ],
      }}
    />
  );
}
