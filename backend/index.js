const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Backend Express fonctionne !');
});

app.listen(port, () => {
  console.log(`Serveur Express écoutant sur le port ${port}`);
});