require('dotenv').config();

const server = require('./server.js');

const PORT = process.env.PORT || 3300;

server.listen(PORT, () => {
    const port = server.address().port;
    console.log(`Express is working on port ${port}`);
})

