# Billing Templates

Reusable page templates for subscription and purchase functionality.

## SubscriptionTemplate

A complete subscription page template with Free | Pro | Premium plans and yearly/monthly billing toggle.

### Usage

```tsx
import { SubscriptionTemplate } from '@donotdev/templates';
import type { PageMeta } from '@donotdev/types';

export function MySubscriptionPage() {
  const meta: PageMeta = {
    namespace: 'subscription',
    auth: { required: true },
    title: 'Subscription Plans',
    entity: 'subscription',
    action: 'view',
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: 'USD',
      interval: 'month',
      description: 'Perfect for getting started',
      features: ['Up to 3 projects', 'Basic components'],
      priceId: '', // No price ID for free plan
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      currency: 'USD',
      interval: 'month',
      description: 'For growing businesses',
      features: ['Unlimited projects', 'All premium components'],
      popular: true,
      priceId: 'price_pro_monthly',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 99,
      currency: 'USD',
      interval: 'month',
      description: 'For enterprise teams',
      features: ['Everything in Pro', 'White-label options'],
      priceId: 'price_premium_monthly',
    },
  ];

  return (
    <SubscriptionTemplate
      namespace="subscription"
      meta={meta}
      plans={plans}
      successUrl="/billing/success"
      cancelUrl="/subscription"
    />
  );
}
```

## PurchaseTemplate

A complete purchase page template for one-time purchases.

### Usage

```tsx
import { PurchaseTemplate } from '@donotdev/templates';
import type { PageMeta } from '@donotdev/types';

export function MyPurchasePage() {
  const meta: PageMeta = {
    namespace: 'purchase',
    auth: { required: true },
    title: 'Purchase Options',
    entity: 'purchase',
    action: 'purchase',
  };

  const products = [
    {
      id: 'lifetime',
      name: 'Lifetime Access',
      price: 499,
      currency: 'EUR',
      description: 'One-time payment for lifetime access',
      features: ['Complete framework access', 'All future updates'],
      popular: true,
      limitedTime: true,
      priceId: 'price_lifetime_access',
    },
  ];

  return (
    <PurchaseTemplate
      namespace="purchase"
      meta={meta}
      products={products}
      successUrl="/billing/success"
      cancelUrl="/purchase"
    />
  );
}
```

## Features

- ✅ **Framework Integration** - Uses PageContainer, PageMeta, and framework components
- ✅ **Auth Required** - Automatically handles authentication
- ✅ **Stripe Integration** - Uses StripePurchase and StripeSubscription components
- ✅ **Responsive Design** - Works on all screen sizes
- ✅ **Customizable** - Pass your own plans/products and metadata
- ✅ **Event Handling** - Events are handled naturally by auth and billing packages
- ✅ **Security** - Secure payment processing through Stripe

## Props

### SubscriptionTemplate

- `namespace: string` - Page namespace for translations
- `meta: PageMeta` - Page metadata
- `plans: SubscriptionPlan[]` - Array of subscription plans
- `successUrl?: string` - Success redirect URL (default: '/billing/success')
- `cancelUrl?: string` - Cancel redirect URL (default: '/subscription')
- `title?: string` - Page title (default: 'Choose Your Plan')
- `subtitle?: string` - Page subtitle

### PurchaseTemplate

- `namespace: string` - Page namespace for translations
- `meta: PageMeta` - Page metadata
- `products: PurchaseProduct[]` - Array of purchase products
- `successUrl?: string` - Success redirect URL (default: '/billing/success')
- `cancelUrl?: string` - Cancel redirect URL (default: '/purchase')
- `title?: string` - Page title (default: 'Get Started')
- `subtitle?: string` - Page subtitle

## Events

The templates automatically handle events through the framework's event system:

- **Auth events** - Handled by the auth package
- **Billing events** - Handled by the billing package
- **Success/Cancel** - Redirect to specified URLs

No additional event handling needed - just use the templates! 🎉
