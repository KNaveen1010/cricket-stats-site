export default async function handler(req, res) {
  try {
    res.status(200).json([
      { id: '253802', name: 'Virat Kohli' },
      { id: '28435', name: 'Joe Root' },
      { id: '253634', name: 'Kane Williamson' },
      { id: '303669', name: 'Babar Azam' }
    ]);
  } catch (e) { res.status(500).json({ error: 'failed' }) }
}
