import express from 'express';
import cors from 'cors';
import videoRouter from './videos';
import config from '../config';

const port = config.server.port;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/videos', videoRouter);

export async function start() {
  return await new Promise<void>(( resolve ) => {
    app.listen(port, () => {
      console.log(`server started on ${port}`);
      resolve()
    });
  })
  
}
