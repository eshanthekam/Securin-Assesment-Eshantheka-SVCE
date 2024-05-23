const express  = require('express')
const dotenv = require('dotenv');
const colors = require('colors');
dotenv.config();

const cors = require('cors')
const cron = require('node-cron');
const port = process.env.PORT || 5000

const {errorHandler} = require('./middlewares/errorMiddleware')
const connectDB = require('./config/dbconfig');
const fetchList = require('./controllers/cveController')
connectDB()
const app = express();
app.use(express.json()) //Body Parser
app.use(express.urlencoded({extended:false})) //urlEncoded
app.use(cors({
    origin:"*"
})) //Cross-Orgin Access

cron.schedule('* * 23 * * *', () => {
    fetchList();
//Fetches the data every day
});

app.use('/api/cve',require('./routes/cveRoutes'));

app.use(errorHandler);
//Overides default ErrorHandler

app.listen(port,()=> console.log(`App up and running on ${port}`))