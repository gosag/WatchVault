import express from 'express';
import routes from './routes/ai.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());
app.use('/api/ai', routes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
