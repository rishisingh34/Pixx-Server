const express = require('express');
const app = express();  
const { PORT } = require('./config/env.config');
const connectDB = require('./config/db.config');
const userRouter = require('./routes/user.routes');  
const authRouter = require('./routes/auth.routes');
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());  
connectDB(); 
app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});