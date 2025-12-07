import axios from 'axios';
export default async function handler(req, res) {
  try {
    const api = await axios.get(`https://api.cricapi.com/v1/series?apikey=${process.env.CRICKET_API_KEY || 'YOUR_API_KEY'}`);
    const ongoing = (api.data.data || []).filter(s => (s.status || '').toLowerCase().includes('live') || (s.status || '').toLowerCase().includes('inprogress'));
    res.status(200).json(ongoing);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to load series' });
  }
}
