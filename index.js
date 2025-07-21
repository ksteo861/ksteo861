
const express = require('express');
const app = express();

// Middleware για να διαβάζει JSON
app.use(express.json());

// Αρχική σελίδα (GET /)
app.get('/', (req, res) => {
  res.send('🌬️ Καλώς ήρθες στην Ανέμωνα API!');
});

// Παράδειγμα POST endpoint (προαιρετικά)
app.post('/chat', (req, res) => {
  const message = req.body.message;
  res.json({ reply: `Εσύ είπες: ${message}` });
});

// Εκκίνηση server
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
