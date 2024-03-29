import express from 'express';
import { Request, Response } from 'express';
import session, { SessionData } from 'express-session';

require('dotenv').config();
const app = express();
const port = process.env.BACKEND_PORT || 3001;
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

interface CustomSession extends SessionData {
  data?: string;
  token?: string;
}

const sharedSession = session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
});

app.use(sharedSession);

const fetchSpotifyToken = async (req: Request) => {
  //https://developer.spotify.com/documentation/web-api/tutorials/getting-started
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=authorization_code&code=' + req.query.code + '&redirect_uri=' + process.env.REDIRECT_URI + '&client_id=' + process.env.CLIENT_ID + '&client_secret=' + process.env.CLIENT_SECRET,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

app.get('/auth', async (req, res) => {
  //https://developer.spotify.com/documentation/general/guides/authorization-guide/
  try {
    const queryParams = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.CLIENT_ID || '',
      scope: 'user-library-read user-library-modify' || '',
      redirect_uri: process.env.REDIRECT_URI || '',
    });
    const url = 'https://accounts.spotify.com/authorize?' + queryParams.toString();
    res.json({ url });    
  } catch (error) {
    console.log(error);
  }
});

app.get('/callback', async (req, res) => {
  try {
    //get the token
    const token = await fetchSpotifyToken(req);
    //get liked musics
    //https://developer.spotify.com/documentation/web-api/reference/get-users-saved-tracks
    const response2 = await fetch('https://api.spotify.com/v1/me/tracks', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token.access_token,
      },
    });
    const data = await response2.json();
    //saved data && token in session
    (req.session as CustomSession).token = token.access_token;
    (req.session as CustomSession).data = data;
    res.redirect('http://localhost:3000?success=true');
  } catch (error) {
    console.log(error);
    res.redirect('http://localhost:3000?success=false');
  }
});

app.get('/liked', (req, res) => {
  (req.session as CustomSession).data ? res.json((req.session as CustomSession).data) : res.json({ error: 'no data' });
});

app.get('/albums', async (req, res) => {
  //https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-an-album
  try {
    const response = await fetch('https://api.spotify.com/v1/albums/' + req.query.id, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + (req.session as CustomSession).token
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.json({ error: 'no data' });
  }
});

app.post('/remove', async (req, res) => {
  //https://developer.spotify.com/documentation/web-api/reference/remove-tracks-user
  try {
    const response = await fetch('https://api.spotify.com/v1/me/tracks?ids=' + req.query.id, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + (req.session as CustomSession).token,
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      res.json({ success: true });
    }
  } catch (error) {
    console.log(error);
    res.json({ error: 'no data' });
  }
});


app.listen(port, () => {
  console.log(`Serveur Express écoutant sur le port ${port}`);
});
