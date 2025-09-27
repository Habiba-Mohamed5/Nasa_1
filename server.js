const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname)));

// Serve node_modules for Leaflet and Chart.js
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// NASA API Configuration
const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const WORLDVIEW_URL = 'https://wvs.earthdata.nasa.gov/api/v1/snapshot';
const NASA_EARTH_URL = 'https://api.nasa.gov/planetary/earth/imagery';

// Handle client-side routing - serve index.html for all SPA routes
app.get(['/', '/home', '/explorer', '/quiz', '/about'], (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// NASA API Proxy Routes - Only for Explorer page
app.get('/api/nasa/worldview', async (req, res) => {
  try {
    const { layers, time, bbox, width = 1600, height = 900 } = req.query;

    if (!layers || !time) {
      return res.status(400).json({ error: 'Missing required parameters: layers, time' });
    }

    const worldviewUrl = `${WORLDVIEW_URL}?REQUEST=GetSnapshot&LAYERS=${layers}&TIME=${time}&BBOX=${bbox}&CRS=EPSG:4326&WIDTH=${width}&HEIGHT=${height}&FORMAT=image/jpeg`;

    const response = await axios.get(worldviewUrl, {
      responseType: 'stream',
      timeout: 30000
    });

    res.set({
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=3600'
    });

    response.data.pipe(res);
    
  } catch (error) {
    console.error('Error fetching NASA Worldview data:', error.message);
    res.status(500).json({ error: 'Failed to fetch NASA data' });
  }
});


// NASA Earth Imagery API
app.get('/api/nasa/earth', async (req, res) => {
  try {
    const { lat, lon, date, dim, cloud_score } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Missing required parameters: lat, lon' });
    }

    let url = `${NASA_EARTH_URL}?api_key=${NASA_API_KEY}&lat=${lat}&lon=${lon}`;
    if (date) url += `&date=${date}`;
    if (dim) url += `&dim=${dim}`;
    if (cloud_score) url += `&cloud_score=${cloud_score}`;
    
    const response = await axios.get(url, { timeout: 15000 });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching NASA Earth imagery:', error.message);
    res.status(500).json({ error: 'Failed to fetch Earth imagery' });
  }
});

// NASA Earth Assets API (for getting available dates)
app.get('/api/nasa/earth/assets', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Missing required parameters: lat, lon' });
    }

    const url = `https://api.nasa.gov/planetary/earth/assets?api_key=${NASA_API_KEY}&lat=${lat}&lon=${lon}`;
    const response = await axios.get(url, { timeout: 10000 });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching NASA Earth assets:', error.message);
    res.status(500).json({ error: 'Failed to fetch Earth assets' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    nasa_api_status: 'connected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 NASA Terra Visualization Server running on port ${PORT}`);
  console.log(`🌍 Visit: http://localhost:${PORT}`);
  console.log(`📊 NASA API Proxy: http://localhost:${PORT}/api/nasa/`);
});

module.exports = app;