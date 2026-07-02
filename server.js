const { config } = require('dotenv')
const app =require('./src/app')
const connectDB = require('./src/db/db')
config()

const port = process.env.PORT || 3000

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})