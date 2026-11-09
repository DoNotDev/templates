# @donotdev/templates

## 0.1.45

### Patch Changes

- `LoginTemplate` renders a working sign-in: the app's enabled auth providers (`MultipleAuthProviders`), navigation to `redirectTo` once signed in, optional `footer` (e.g. sign-up link). Shows a spinner while auth initializes (it used to show the "authentication not available" error during load) and the error only when auth is disabled or `@donotdev/auth` is missing. Placeholder text removed.
- `CheckoutPageTemplate`: 0.1.x callers passing only `priceId` get the checkout button again. The config key is `configKey`, else `billingOptions.metadata.billingConfigKey` (same resolution as `useStripeBilling`); `priceId` is forwarded to `StripeCheckoutButton`.

## 0.1.43

### Patch Changes

- a4c57d7: bugfixes and performance upgrades
- Updated dependencies [20f9a0e]
- Updated dependencies [064cfbb]
- Updated dependencies [98d641c]
- Updated dependencies [a4c57d7]
- Updated dependencies [2b8210a]
  - @donotdev/crud@0.1.44
  - @donotdev/core@0.1.43
  - @donotdev/components@0.1.44
  - @donotdev/auth@0.1.43
  - @donotdev/billing@0.1.43
  - @donotdev/oauth@0.1.43
