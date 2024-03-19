import prisma from '@/configs/prisma';
import {
  handleCancelPlan,
  handleCheckoutSessionCompleted,
  handleSubscriptionSessionCompleted,
  stripe,
} from '@/utils/stripe';
import { NextFunction, Request, Response } from 'express';

class WebhookController {
  async webhook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const signature = req.headers['stripe-signature'] as string;

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_ID_WEBHOOK as string
      );
    } catch (err) {
      res.status(400).send(`Webhook Error`);
      return;
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionSessionCompleted(event);
        break;
      case 'customer.subscription.deleted':
        await handleCancelPlan(event);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.send();
  }
}

export default WebhookController;
