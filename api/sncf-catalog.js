// api/sncf-catalog.js
// Proxy vers le catalogue Opendatasoft pour lister/chercher les datasets.
// Usage : /api/sncf-catalog?q=gtfs%20stop_times

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const { q = "" } = req.query;
    const url = `https://data.sncf.com/api/datasets/1.0/search/?q=${encodeURIComponent(q)}`;
    const r = await fetch(url);
    const data = await r.json();
    res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=300");
    return res.status(r.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e?.message || "catalog_error" });
  }
}
