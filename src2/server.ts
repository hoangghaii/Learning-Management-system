import { app } from '@/app';
import { connectDB } from '@/libs/db';
import { _log } from '@/utils/_log';
import 'dotenv/config';

//create server
const port = process.env.PORT || 8000;

app.listen(port, () => {
  _log('Server is running on port:', port);
  connectDB();
});
