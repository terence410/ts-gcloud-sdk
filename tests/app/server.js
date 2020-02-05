const express = require('express');
const app = express();

app.get('/', async (req, res) => {
    res.send('Hello from App Engine!');

    let total = 30;
    for (let i = 0; i < total; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000 * i));
        console.log("app engine", i, new Date());
    }
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
