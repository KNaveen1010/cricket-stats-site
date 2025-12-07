import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default function ComparisonChart({ dataA, dataB, mode = 'year' }) {
  if (!dataA || !dataB) return null;

  if (mode === 'year') {
    const labels = Array.from(new Set([...dataA.map(d => d.year), ...dataB.map(d => d.year)])).sort();
    const runsA = labels.map(l => (dataA.find(d => d.year === l)?.runs || 0));
    const runsB = labels.map(l => (dataB.find(d => d.year === l)?.runs || 0));

    return (
      <Bar
        data={{
          labels,
          datasets: [
            { label: 'Player A Runs', data: runsA },
            { label: 'Player B Runs', data: runsB }
          ]
        }}
      />
    );
  }

  const topCountries = Array.from(new Set([...dataA.map(d => d.country), ...dataB.map(d => d.country)])).slice(0, 10);
  const runsA = topCountries.map(c => dataA.find(d => d.country === c)?.runs || 0);
  const runsB = topCountries.map(c => dataB.find(d => d.country === c)?.runs || 0);

  return (
    <Bar
      data={{
        labels: topCountries,
        datasets: [
          { label: 'Player A Runs', data: runsA },
          { label: 'Player B Runs', data: runsB }
        ]
      }}
    />
  );
}
