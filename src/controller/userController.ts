import prisma from '@/configs/prisma';
import { createStripeCustomer } from '@/utils/stripe';
import { NextFunction, Request, Response } from 'express';

class UserController {
  async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const data = await prisma.user.findMany();
      return res.status(200).json(data);
    } catch (e) {
      return next(e);
    }
  }

  async save(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const body = req.body;
      const customer = await createStripeCustomer({
        email: body.email,
        name: body.name,
      });

      const data = await prisma.user.create({
        data: { ...body, stripeCustumerId: customer.id },
      });
      return res.status(200).json(data);
    } catch (e) {
      return next(e);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const id = req.params.id;
      const data = await prisma.user.findFirst({ where: { id } });
      return res.status(200).json(data);
    } catch (e) {
      return next(e);
    }
  }
}

export default UserController;
