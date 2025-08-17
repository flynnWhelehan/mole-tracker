import 'dotenv/config';
import express, { json, Application } from 'express';
import cors from 'cors';
import connectDB from './services/db.js';
import moleRoutes from './routes/moleRoutes.js';

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '5000');

connectDB();

app.use(cors());
app.use(json());

app.use('/api/moles', moleRoutes);

app.listen(PORT, () => {
	console.log(`Server running on port: ${PORT}`);
});
