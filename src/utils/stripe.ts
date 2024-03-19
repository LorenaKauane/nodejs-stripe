import prisma from '@/configs/prisma';
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET as string, {
  httpClient: Stripe.createFetchHttpClient(),
});

export const getStripeCustomerByEmail = async (email: string) => {
  const custumers = await stripe.customers.list({ email });
  return custumers.data[0];
};

export const createStripeCustomer = async (data: {
  email: string;
  name?: string;
}) => {
  const custumer = await getStripeCustomerByEmail(data?.email);
  if (custumer) return custumer;

  return stripe.customers.create({
    email: data.email,
    name: data.name,
  });
};

export const generateCheckout = async (userId: string, email: string) => {
  try {
    const customer = await createStripeCustomer({
      email,
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      client_reference_id: userId,
      customer: customer.id,
      success_url: `http://localhost:3000/done`,
      cancel_url: `http://localhost:3000/error`,
      line_items: [
        {
          price: process.env.STRIPE_ID_PLAN,
          quantity: 1,
        },
      ],
    });

    return {
      url: session.url,
    };
  } catch (error) {
    console.log('errr', error);
  }
};

export const handleCheckoutSessionCompleted = async (event: {
  data: { object: Stripe.Checkout.Session };
}) => {
  const idUser = event.data.object.client_reference_id as string;
  const stripeSubscriptionId = event.data.object.subscription as string;
  const stripeCustumerId = event.data.object.customer as string;
  const checkoutStatus = event.data.object.status;

  if (checkoutStatus !== 'complete') return;

  if (!idUser || !stripeSubscriptionId || !stripeCustumerId) {
    throw new Error(
      'idUser, stripeSubscriptionId, stripeCustumerId is required'
    );
  }

  const userExist = await prisma.user.findFirst({ where: { id: idUser } });

  if (!userExist) {
    throw new Error('user not found');
  }

  await prisma.user.update({
    where: {
      id: userExist.id,
    },
    data: {
      stripeCustumerId,
      stripeSubscriptionId,
    },
  });
};

export const handleSubscriptionSessionCompleted = async (event: {
  data: { object: Stripe.Subscription };
}) => {
  const subscriptionStatus = event.data.object.status;
  const stripeCustumerId = event.data.object.customer as string;
  const stripeSubscriptionId = event.data.object.id as string;

  const userExist = await prisma.user.findFirst({
    where: { stripeCustumerId },
  });

  if (!userExist) {
    throw new Error('user stripeCustumerId not found');
  }

  await prisma.user.update({
    where: {
      id: userExist.id,
    },
    data: {
      stripeCustumerId,
      stripeSubscriptionId,
      stripeSubscriptionStatus: subscriptionStatus,
    },
  });
};

export const handleCancelPlan = async (event: {
  data: { object: Stripe.Subscription };
}) => {
  const stripeCustumerId = event.data.object.customer as string;

  const userExist = await prisma.user.findFirst({
    where: { stripeCustumerId },
  });

  if (!userExist) {
    throw new Error('user stripeCustumerId not found');
  }

  await prisma.user.update({
    where: {
      id: userExist.id,
    },
    data: {
      stripeCustumerId,
      stripeSubscriptionStatus: null,
    },
  });
};

export const handleCancelSubscription = async (idSubscriptions: string) => {
  const subscription = await stripe.subscriptions.update(idSubscriptions, {
    cancel_at_period_end: true,
  });

  return subscription;
};

export const createPortalCustomer = async (idCustomer: string) => {
  const subscription = await stripe.billingPortal.sessions.create({
    customer: idCustomer,
    return_url: 'http://localhost:3000/',
  });

  return subscription;
};
