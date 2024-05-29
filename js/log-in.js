const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const bodyParser = require('body-parser');
const path = require('path');

const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/tokensignin', async (req, res) => {
  const token = req.body.id_token;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    res.status(200).send(payload);
  } catch (error) {
    res.status(400).send('Token verification failed');
  }
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
