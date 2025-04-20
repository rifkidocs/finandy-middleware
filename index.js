const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// Mapping coin ke URL Finandy
const webhooks = {
  WIF: "https://hook.finandy.com/zjCa0TX_eQJKGZYyrlUK",
  GRT: "https://hook.finandy.com/c1nK0JXjQT05vV8DrlUK",
  PEPE: "https://hook.finandy.com/MjxbIyQkK2q6b5FLrlUK",
  AEVO: "https://hook.finandy.com/9VDmUcvnqNZahcR0rlUK"
};

// Antrean per coin
const queues = {};
const processing = {};
const lastProcessed = {};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processQueue(coin) {
  if (processing[coin] || !queues[coin]?.length) return;

  processing[coin] = true;

  const { payload, url } = queues[coin].shift();
  const now = Date.now();
  const lastTime = lastProcessed[coin] || 0;
  const timeSinceLastProcess = now - lastTime;
  
  try {
    // Jika alert pertama atau sudah lewat 1 menit dari alert terakhir, proses langsung
    if (!lastTime || timeSinceLastProcess > 60000) {
      console.log(`✅ [${coin}] Langsung diproses (alert pertama atau > 1 menit)`);
      await axios.post(url, payload);
      console.log(`✅ [${coin}] Dikirim ke Finandy`);
    } else {
      // Jika ada alert dalam 1 menit terakhir, delay 30 detik
      console.log(`⏳ [${coin}] Delay 30 detik...`);
      await delay(30000);
      await axios.post(url, payload);
      console.log(`✅ [${coin}] Dikirim ke Finandy`);
    }
    
    // Update waktu terakhir proses
    lastProcessed[coin] = Date.now();
  } catch (err) {
    console.error(`❌ [${coin}] Gagal kirim alert:`, err.message);
  }

  processing[coin] = false;

  if (queues[coin].length > 0) {
    processQueue(coin); // Lanjut ke alert berikutnya
  }
}

app.post('/webhook', (req, res) => {
  const payload = req.body;
  const coin = payload.name;

  const url = webhooks[coin];
  if (!url) {
    console.warn(`⚠️ Coin ${coin} tidak dikenali`);
    return res.status(400).send("Unknown coin");
  }

  if (!queues[coin]) queues[coin] = [];
  queues[coin].push({ payload, url });

  console.log(`📥 [${coin}] Alert masuk, antre ke-${queues[coin].length}`);

  res.sendStatus(200); // Balas cepat ke TradingView
  processQueue(coin);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Middleware jalan di http://localhost:${PORT}`);
}); 