 import lightKiteServer from 'light-kite';
import {connectDB} from './src/core/config/db';
import modules from './src/modules';

import 'dotenv/config';

connectDB();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret';

const app = lightKiteServer(modules);

app.useUserSocket(JWT_SECRET_KEY, {
  cors: {
    origin: '*',
  },
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.run(PORT, () => {
  console.log(`Core Service running on port ${PORT}`);
});
