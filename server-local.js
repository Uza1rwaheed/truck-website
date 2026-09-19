const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/quote', (req, res) => {
  const { name, email, service, details } = req.body;

  if (!name || !email || !service || !details) {
    return res.status(400).json({ message: 'Please complete all required fields.' });
  }

  return res.json({ message: 'Your request has been received. We will contact you shortly.' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
