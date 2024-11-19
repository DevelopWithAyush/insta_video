const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

// Instagram Graph API Access Token
const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

// Endpoint to search location and get reels
app.get('/api/reels', async (req, res) => {
  const { locationName } = req.query;

  if (!locationName) {
    return res.status(400).json({ error: 'Location name is required' });
  }

  try {
    // Step 1: Search for the location ID
    const locationResponse = await axios.get(
      `https://graph.facebook.com/v12.0/search`,
      {
        params: {
          type: 'place',
          q: locationName,
          fields: 'id,name,location',
          access_token: ACCESS_TOKEN,
        },
      }
    );

    if (!locationResponse.data.data.length) {
      return res.status(404).json({ error: 'Location not found' });
    }

    // Get the first location ID from the response
    const locationId = locationResponse.data.data[0].id;

    // Step 2: Fetch media for the location
    const mediaResponse = await axios.get(
      `https://graph.facebook.com/v12.0/${locationId}/media`,
      {
        params: {
          access_token: ACCESS_TOKEN,
          fields: 'id,media_type,media_url,caption',
        },
      }
    );

    // Filter only video media
    const reels = mediaResponse.data.data.filter(
      (item) => item.media_type === 'VIDEO'
    );

    res.json(reels);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error fetching reels data' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
