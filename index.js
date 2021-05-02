require('dotenv').config();

const server = require('./server.js');

const PORT = process.env.PORT || 3300;

server.listen(PORT, () => {
    console.log(`Express is working on port ${PORT}`);
})

server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });