import prisma from '@/configs/prisma';
import {
  createPortalCustomer,
  createStripeCustomer,
  generateCheckout,
} from '@/utils/stripe';
import { NextFunction, Request, Response } from 'express';

class CheckoutController {
  async creteCheckout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const id = req.params.id;
      const user = await prisma.user.findFirst({ where: { id } });

      if (!user) {
        return res.status(404).json('Usuario nao encontrado');
      }

      const checkout = await generateCheckout(user.id, user.email);

      return res.status(200).json(checkout);
    } catch (e) {
      return next(e);
    }
  }

  async createPortal(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const id = req.params.id;
      const user = await prisma.user.findFirst({ where: { id } });

      if (!user) {
        return res.status(404).json('Usuario nao encontrado');
      }

      const portal = await createPortalCustomer(
        user.stripeCustumerId as string
      );

      return res.status(200).json(portal);
    } catch (e) {
      return next(e);
    }
  }
}

export default CheckoutController;
