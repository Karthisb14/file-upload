const express = require('express')
require('./db/database')
const fileuploadrouter = require('./router/fileupload')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(fileuploadrouter)


app.listen(port, () => {
    console.log(`Server is up on Running at ${port}`)
})