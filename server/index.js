import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/users.js';
import questionRoutes from './routes/Questions.js';
import answerRoutes from './routes/Answers.js';
import path from "path";


const app = express();
dotenv.config();
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

app.use('/user', userRoutes);
app.use('/questions', questionRoutes);
app.use('/answer', answerRoutes);


/* ------ Deployement Start ----------*/
const __dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  })
}
else {
  app.get('/', (req, res) => {
    res.send('This is a stack overflow clone API');
  });
}

/* ------ Deployement End ------------*/

mongoose.set('strictQuery', false);

const PORT = process.env.PORT || 5000;

// Listen for the `connected` event.
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB successfully!');
});

mongoose.connect(process.env.CONNECTION_URL, { useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`server running on port ${PORT}`)))
  .catch((err) => console.log(err.message));
