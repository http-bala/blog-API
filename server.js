const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const blogRoutes = require('./routes/blogRoutes');


dotenv.config();
connectDB();

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/',(req,res)=>{
    return res.send("Api is Working");
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/blogs', blogRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
