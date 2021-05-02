require('dotenv').config();

const server = require('./server.js');

const PORT = process.env.PORT || 3300;

server.listen(PORT, () => {
    console.log(`Express is working on port ${PORT}`);
})

