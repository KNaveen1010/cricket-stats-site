import { useState, useEffect } from 'react';
import axios from 'axios';
import RunsChart from '../components/RunsChart';

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [stats, setStats] = useState(null);
  const [seriesList, setSeriesList] = useState([]);

  useEffect(() => {
    async function fetchSeries() {
      try {
        const res = await axios.get(`/api/series`);
        setSeriesList(res.data);
      } catch (e) {
        console.error(e);
      }
    }
    async function loadPlayers() {
      try {
        const res = await axios.get('/api/players');
        setPlayers(res.data);
      } catch (e) {
        console.error(e);
      }
    }
    fetchSeries();
    loadPlayers();
  }, []);

  useEffect(() => {
    if (!selectedPlayer) return;
    async function fetchStats() {
      try {
        const res = await axios.get(`/api/stats?playerId=${selectedPlayer}`);
        setStats(res.data);
      } catch (e) {
        console.error(e);
      }
    }
    fetchStats();
  }, [selectedPlayer]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Cricket Stats Analyzer</h1>

      <h3>Live & Running Series</h3>
      <ul>
        {seriesList.map((s) => (
          <li key={s.id}>{s.name} ({s.status})</li>
        ))}
      </ul>

      <h3>Select Player</h3>
      <select onChange={(e) => setSelectedPlayer(e.target.value)}>
        <option value="">Select</option>
        {players.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      {stats && (
        <div>
          <h2>{stats.name} - Career Summary</h2>
          <p>Runs: {stats.totalRuns}</p>
          <p>Average: {stats.average}</p>
          <p>Strike Rate: {stats.strikeRate}</p>

          <h3>Match-by-Match Runs</h3>
          <RunsChart data={stats.matchRuns || []} />
        </div>
      )}
    </div>
  );
}
