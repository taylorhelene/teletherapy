const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true,
   useUnifiedTopology: true,
   
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));
