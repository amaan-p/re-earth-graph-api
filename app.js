const express = require("express");
const NodeCache = require("node-cache");

const app = express();
const cache = new NodeCache({ stdTTL: 86400}); // 20 minutes TTL (in seconds)

const options = ["Metals", "Plastics", "E-Waste", "Paper"];

function generateCoordinates() {
  const coordinates = [];
  for (let i = 0; i <= 5; i++) {
    const x = i;
    const y = Math.random() * 4.5; // Random y-coordinate between 0 and 5
    coordinates.push({ x, y });
  }
  return coordinates;
}

app.get('/coordinates', (req, res) => {
  const option = req.query.option;

  if (!option) {
    // Return coordinates for all options
    const allCoordinates = {};

    for (const opt of options) {
      const cacheKey = `coordinates:${opt}`;
      const cachedCoordinates = cache.get(cacheKey);

      if (cachedCoordinates) {
        allCoordinates[opt] = cachedCoordinates;
      } else {
        const coordinates = generateCoordinates();
        cache.set(cacheKey, coordinates);
        allCoordinates[opt] = coordinates;
      }
    }

    res.json(allCoordinates);
  } else if (options.includes(option)) {
    const cacheKey = `coordinates:${option}`;
    const cachedCoordinates = cache.get(cacheKey);

    if (cachedCoordinates) {
      res.json(cachedCoordinates);
    } else {
      const coordinates = generateCoordinates();
      cache.set(cacheKey, coordinates);
      res.json(coordinates);
    }
  } else {
    res.status(404).json({ error: 'Invalid option' });
  }
});

app.listen(3000);
