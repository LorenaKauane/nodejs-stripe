import CheckoutController from '@/controller/checkoutController';
import WebhookController from '@/controller/webhookController';

import { NextFunction, Request, Response, Router, raw } from 'express';

class WebhookRoute {
  public static create(router: Router) {
    const endpoint = new WebhookController();

    router.post(
      '/webhook',
      raw({ type: 'application/json' }),
      (req: Request, res: Response, next: NextFunction) => {
        endpoint.webhook(req, res, next);
      }
    );
  }
}

export { WebhookRoute };
