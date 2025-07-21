
const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(express.json());

// Αρχική σελίδα
app.get('/', (req, res) => {
  res.send('🌬️ Καλώς ήρθες στην Ανέμωνα API!');
});

// Ενσωματωμένο UI στο /ui
app.get('/ui', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="el">
    <head>
      <meta charset="UTF-8">
      <title>Ανέμωνα - Δοκιμή Επικοινωνίας</title>
    </head>
    <body style="font-family: sans-serif; padding: 2rem;">
      <h1>💬 Ανέμωνα - Δοκιμή</h1>
      <label for="message">Μήνυμα:</label>
      <input type="text" id="message" style="width: 60%;" />
      <button onclick="sendMessage()">Στείλε</button>
      <p><strong>Απάντηση:</strong></p>
      <div id="response" style="white-space: pre-wrap; background: #f0f0f0; padding: 1rem; border-radius: 8px;"></div>

      <script>
        async function sendMessage() {
          const msg = document.getElementById('message').value;
          const responseDiv = document.getElementById('response');
          responseDiv.textContent = "⏳ Περιμένουμε απάντηση...";

          try {
            const res = await fetch('/chat', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ message: msg })
            });

            const data = await res.json();
            responseDiv.textContent = data.reply || "⚠️ Καμία απάντηση.";
          } catch (err) {
            responseDiv.textContent = "❌ Σφάλμα: " + err.message;
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Chat endpoint
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: message }],
    });
    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
