import * as express from 'express';
import { Request, Response } from 'express';

require('dotenv').config();
const app = express();
const port = process.env.BACKEND_PORT || 3001;
const cors = require('cors');

app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'response ok' });
});

app.get('/auth', (req, res) => {
  setTimeout(() => {
    res.send({ message: 'response ok' });
  }, 3000);
});

app.listen(port, () => {
  console.log(`Serveur Express écoutant sur le port ${port}`);
});
