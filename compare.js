import axios from 'axios';
const API_KEY = process.env.CRICKET_API_KEY || 'YOUR_API_KEY';
const BASE = 'https://api.cricapi.com/v1';

async function fetchPlayerMatches(playerId, query={}) {
  const url = `${BASE}/player_matches?apikey=${API_KEY}&id=${playerId}`;
  const r = await axios.get(url);
  return r.data.data || [];
}

function aggregateByYearAndCountry(matches) {
  const yearMap = {};
  const countryMap = {};
  for (const m of matches) {
    const date = m.date || m.match_date;
    const d = date ? new Date(date) : null;
    const year = d ? d.getFullYear() : 'Unknown';
    const country = m.venue_country || m.country || 'Unknown';
    const runs = Number(m.runs || 0);
    const wickets = Number(m.wickets || 0);
    if (!yearMap[year]) yearMap[year] = { runs: 0, wickets: 0 };
    yearMap[year].runs += runs;
    yearMap[year].wickets += wickets;
    if (!countryMap[country]) countryMap[country] = { runs: 0, wickets: 0 };
    countryMap[country].runs += runs;
    countryMap[country].wickets += wickets;
  }
  const yearArr = Object.keys(yearMap).sort().map(y => ({ year: y, runs: yearMap[y].runs, wickets: yearMap[y].wickets }));
  const countryArr = Object.keys(countryMap).sort().map(c => ({ country: c, runs: countryMap[c].runs, wickets: countryMap[c].wickets }));
  return { yearArr, countryArr };
}

export default async function handler(req, res) {
  const { p1, p2 } = req.query;
  if (!p1 || !p2) return res.status(400).json({ error: 'p1 and p2 required' });
  try {
    const [m1, m2] = await Promise.all([fetchPlayerMatches(p1), fetchPlayerMatches(p2)]);
    const a1 = aggregateByYearAndCountry(m1);
    const a2 = aggregateByYearAndCountry(m2);
    const player1 = { id: p1, name: `Player ${p1}`, yearRuns: a1.yearArr.map(y => ({ year: y.year, runs: y.runs })), countryRuns: a1.countryArr.map(c => ({ country: c.country, runs: c.runs })), totalRuns: a1.yearArr.reduce((s, x) => s + x.runs, 0), totalWickets: a1.yearArr.reduce((s, x) => s + x.wickets, 0) };
    const player2 = { id: p2, name: `Player ${p2}`, yearRuns: a2.yearArr.map(y => ({ year: y.year, runs: y.runs })), countryRuns: a2.countryArr.map(c => ({ country: c.country, runs: c.runs })), totalRuns: a2.yearArr.reduce((s, x) => s + x.runs, 0), totalWickets: a2.yearArr.reduce((s, x) => s + x.wickets, 0) };
    res.status(200).json({ player1, player2 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed to compute comparison' });
  }
}
