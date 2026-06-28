import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/db.js';

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskflow';

await connectDatabase(MONGODB_URI);

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
