export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const { coordinates, profile } = req.body;
  const validProfiles = ['cycling-regular', 'cycling-mountain', 'cycling-road', 'cycling-electric'];
  const selectedProfile = validProfiles.includes(profile) ? profile : 'cycling-regular';

  try {
    const response = await fetch(`https://api.openrouteservice.org/v2/directions/${selectedProfile}/geojson`, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ coordinates })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
