const express = require('express');
const redis = require('redis');
const app = express();

const REDISHOST = process.env.REDISHOST || 'localhost';
const REDISPORT = process.env.REDISPORT || 6378;

const client = redis.createClient(REDISPORT, REDISHOST);
client.on('error', (err) => console.error('ERR:REDIS:', err));


app.get('/redis', async (req, res) => {
    res.send('<pre>' + JSON.stringify(client.server_info, null, 2) + '</pre>');
});

app.get('/', async (req, res) => {
    res.send('<pre>' + JSON.stringify(process.env, null, 2) + '</pre>');

    let total = 30;
    for (let i = 0; i < total; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000 * i));
        console.log("app engine", i, new Date());
    }
});


app.get('/exit', async (req, res) => {
    res.send("exit");

    setImmediate(() => {
        process.exit(1);
    })
});



// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
