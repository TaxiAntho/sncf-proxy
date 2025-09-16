// api/sncf-odata.js
// Proxy gratuit vers data.sncf.com (Opendatasoft) pour éviter le CORS côté navigateur.
// Usage : /api/sncf-odata?dataset=<slug>&params=<querystring encodé>

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const { dataset, params = "" } = req.query;
    if (!dataset) return res.status(400).json({ error: "Missing dataset parameter" });

    const base = `https://data.sncf.com/api/records/1.0/search/?dataset=${encodeURIComponent(dataset)}`;
    const url = params ? `${base}&${params}` : base;

    const r = await fetch(url);
    const data = await r.json();
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
    return res.status(r.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e?.message || "proxy_error" });
  }
}
