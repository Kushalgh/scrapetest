const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(bodyParser.json());

// Create or connect to the SQLite database
const db = new sqlite3.Database('data.db');

// Create the "stock_data" table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS stock_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sn TEXT,
  symbol TEXT,
  close_price TEXT,
  open_price TEXT,
  high_price TEXT,
  low_price TEXT,
  traded_quantity TEXT,
  traded_value TEXT,
  trades TEXT,
  ltp TEXT,
  previous_close_price TEXT,
  average_traded_price TEXT,
  week_52_high TEXT,
  week_52_low TEXT,
  market_capitalization TEXT
)`);

// Endpoint to receive the extracted data
app.post('/api/stock-data', (req, res) => {
  const stockData = req.body;

  // Insert the stock data into the database
  const stmt = db.prepare(`INSERT INTO stock_data (
    sn, symbol, close_price, open_price, high_price, low_price,
    traded_quantity, traded_value, trades, ltp, previous_close_price,
    average_traded_price, week_52_high, week_52_low, market_capitalization
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  stockData.forEach((data) => {
    stmt.run(
      data.sn,
      data.symbol,
      data.closePrice,
      data.openPrice,
      data.highPrice,
      data.lowPrice,
      data.tradedQuantity,
      data.tradedValue,
      data.trades,
      data.ltp,
      data.previousClosePrice,
      data.averageTradedPrice,
      data.week52High,
      data.week52Low,
      data.marketCapitalization
    );
  });

  stmt.finalize();

  res.sendStatus(200);
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});