require('babel-register');
const app = require('./server/server');
require('dotenv').config();

const PORT = process.env.NODE_ENV === "test" ? 0 : process.env.PORT;

console.log(`Looks like we are in ${process.env.NODE_ENV} mode!`.bold.yellow);

// FOR TEMPORARY DEV USE ONLY!
// const fs = require('fs')
// const https = require('https')
// https.createServer({
//   key: fs.readFileSync('server/server.key'),
//   cert: fs.readFileSync('server/server.cert')
// }, app).listen(PORT + 1, () => {
//   console.log(`Listening (ssl) on port: ${process.env.PORT+1}`);
// });

app.listen(PORT, () => {
  console.log(`Listening on port: ${process.env.PORT}`.bold.blue);
});
