import express from 'express';
import cors from 'cors';
import { UserRouter } from '@/routes/userRoute';

class App {
  public express: express.Express;

  constructor() {
    this.express = express();
    this.midleware();
    this.routes();
  }

  private routes(): void {
    const router = express.Router();
    router.get('/', (req, res) => {
      res.send('Works well');
    });
    UserRouter.create(router);
    this.express.use('/api', router);
  }

  private midleware(): void {
    this.express.use(express.json());
    this.express.use(cors());
  }
}

export default new App().express;
