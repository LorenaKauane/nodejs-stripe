import CheckoutController from '@/controller/checkoutController';

import { NextFunction, Request, Response, Router } from 'express';

class CheckoutRoute {
  public static create(router: Router) {
    const endpoint = new CheckoutController();

    router.get(
      '/checkout/:id',
      (req: Request, res: Response, next: NextFunction) => {
        endpoint.creteCheckout(req, res, next);
      }
    );

    router.get(
      '/portal/stripe/:id',
      (req: Request, res: Response, next: NextFunction) => {
        endpoint.createPortal(req, res, next);
      }
    );
  }
}

export { CheckoutRoute };
