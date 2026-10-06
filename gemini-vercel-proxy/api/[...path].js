export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // 🔑 關鍵修正：把 Vercel 附加的 '/api' 刪除，還原成純淨的 Google 路徑
        const cleanPath = req.url.replace(/^\/api/, '');
        const targetUrl = `https://generativelanguage.googleapis.com${cleanPath}`;
        
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: { 'content-type': 'application/json' },
            body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
