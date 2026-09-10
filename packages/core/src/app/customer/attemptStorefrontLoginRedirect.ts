import { type StoreConfig } from '@bigcommerce/checkout-sdk';

import { toStorefrontUrl } from '@bigcommerce/checkout/utility';

export function attemptStorefrontLoginRedirect(config?: StoreConfig): boolean {
    if (!config?.checkoutSettings.shouldRedirectToStorefrontForAuth) {
        return false;
    }

    window.location.assign(
        `${toStorefrontUrl(config.links.loginLink)}?redirectTo=${toStorefrontUrl(
            config.links.checkoutLink,
        )}`,
    );

    return true;
}
