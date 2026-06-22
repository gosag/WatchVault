import express from 'express';
import routes from './routes/ai.js';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'POST',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
};
dotenv.config();
const app = express();
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/ai', routes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
