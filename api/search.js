const axios = require('axios');
const config = require('../lib/config');

module.exports = async (req, res) => {
    // 1. Input Check (User ne number diya ya nahi)
    const number = req.query.number || req.query.search || req.query.q;

    if (!number) {
        return res.status(400).json({
            status: false,
            developer: config.developer,
            team: config.team,
            channel: config.channel,
            message: "Please provide a number. Example: ?number=03xxxxxxxxx"
        });
    }

    try {
        // 2. Upstream API Call
        const apiUrl = `${config.upstreamApi}?search=${encodeURIComponent(number)}`;
        console.log(`[API] Fetching from upstream: ${apiUrl}`);

        const response = await axios.get(apiUrl, { timeout: 30000 });
        const data = response.data;

        // 3. Check if data exists
        if (!data || !data.results || data.results.length === 0) {
            return res.status(404).json({
                status: false,
                developer: config.developer,
                team: config.team,
                channel: config.channel,
                contact: config.contact,
                query: number,
                message: "No records found for this number."
            });
        }

        // 4. Send Response with YOUR Custom Branding
        res.status(200).json({
            status: true,
            developer: config.developer,       // Changed
            team: config.team,                 // Changed
            channel: config.channel,           // Changed
            contact: config.contact,           // Added
            query: data.query,
            found: data.found,
            total: data.total,
            results: data.results,             // Original Data
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('[API Error]', error.message);
        res.status(500).json({
            status: false,
            developer: config.developer,
            team: config.team,
            channel: config.channel,
            message: "Upstream API failed or timed out.",
            error: error.message
        });
    }
};
