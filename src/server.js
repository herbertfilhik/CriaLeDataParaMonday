const http = require('http');
const path = require('path');
const express = require('express');

const app = express();

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

const server = http.createServer(app);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
