import express, { Request, Response } from 'express';

const app = express();
const port = 3001;

app.get('/', (req: Request, res: Response) => {
  res.send('Backend Express fonctionne !');
});

app.listen(port, () => {
  console.log(`Serveur Express écoutant sur le port ${port}`);
});
