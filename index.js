const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(8080, (req, res) => {
  console.log('Connected Server 8080');
});
