const express = require('express');
const cors = require('cors');
const searchRoute = require('./api/search');

const app = express();
app.use(cors());

// Route Setup
app.get('/api/search', searchRoute);
app.get('/search', searchRoute); // Short URL

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 MUZAMIL-XD API running on port ${PORT}`);
});
