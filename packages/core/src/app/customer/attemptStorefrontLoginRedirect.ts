import { type StoreConfig } from '@bigcommerce/checkout-sdk';

import { assignLocation } from '@bigcommerce/checkout/dom-utils';
import { toStorefrontUrl } from '@bigcommerce/checkout/utility';

export function attemptStorefrontLoginRedirect(config?: StoreConfig): boolean {
    if (!config?.checkoutSettings.shouldRedirectToStorefrontForAuth) {
        return false;
    }

    assignLocation(
        `${toStorefrontUrl(config.links.loginLink)}?redirectTo=${toStorefrontUrl(
            config.links.checkoutLink,
        )}`,
    );

    return true;
}
