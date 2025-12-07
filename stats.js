import axios from 'axios';
export default async function handler(req, res) {
  const { playerId } = req.query;
  if (!playerId) return res.status(400).json({ error: 'playerId required' });
  try {
    const api = await axios.get(`https://api.cricapi.com/v1/players_info?apikey=${process.env.CRICKET_API_KEY || 'YOUR_API_KEY'}&id=${playerId}`);
    const p = api.data.data || {};
    res.status(200).json({
      name: p.name || `Player ${playerId}`,
      totalRuns: (p.stats && p.stats.totalRuns) || 0,
      average: (p.stats && p.stats.average) || null,
      strikeRate: (p.stats && p.stats.strikeRate) || null,
      matchRuns: (p.stats && p.stats.matchRuns) || []
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to load stats' });
  }
}
