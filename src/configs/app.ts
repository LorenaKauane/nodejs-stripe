import express from 'express';
import cors from 'cors';
import { UserRouter } from '@/routes/userRoute';
import { CheckoutRoute } from '@/routes/checkoutRoute';
import { WebhookRoute } from '@/routes/webhookRoute';

class App {
  public express: express.Express;

  constructor() {
    this.express = express();
    this.webhook();
    this.midleware();
    this.routes();
  }

  private routes(): void {
    const router = express.Router();
    router.get('/', (req, res) => {
      res.send('Works well');
    });
    UserRouter.create(router);
    CheckoutRoute.create(router);
    this.express.use('/api', router);
  }

  private midleware(): void {
    this.express.use(express.json());
    this.express.use(cors());
  }

  private webhook(): void {
    const router = express.Router();
    WebhookRoute.create(router);
    this.express.use('/data', router);
  }
}

export default new App().express;
