import express from 'express';
import { Request, Response } from 'express';
import session from 'express-session';

require('dotenv').config();
const app = express();
const port = process.env.BACKEND_PORT || 3001;
const cors = require('cors');

app.use(cors());

app.use(session({
  secret: process.env.SESSION_SECRET || '',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'response ok' });
});

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
      scope: 'user-library-read' || '',
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
    //stocker data
    if ('data' in req.session) {
      req.session.data = data;
      console.log(req.session.data);
    }
    //rediriger vers le front
    res.redirect('localhost:3000');
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Serveur Express écoutant sur le port ${port}`);
});
