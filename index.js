const express = require('express')//express insatall
const app = express()//create express app
const port = 3000//port give

// parse application/x-www-form-urlencoded
app.use(express.urlencoded())

// parse application/json
app.use(express.json())

const fileRoutes = require('./routes/fileRoutes');

app.use('/uploads', express.static('uploads')); // Serve static files
app.use('/api/v1/files', fileRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
