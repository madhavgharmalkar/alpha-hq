const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000

app.get('/hello', (req, res) => res.sendStatus(200))

app.listen(PORT, () => console.log(`server listening on port ${PORT}`))
