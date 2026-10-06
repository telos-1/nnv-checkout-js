import { assignLocation } from '@bigcommerce/checkout/dom-utils';
import { toStorefrontUrl } from '@bigcommerce/checkout/utility';

import { getStoreConfig } from '../config/config.mock';

import { attemptStorefrontLoginRedirect } from './attemptStorefrontLoginRedirect';

jest.mock('@bigcommerce/checkout/dom-utils', () => ({
    ...jest.requireActual('@bigcommerce/checkout/dom-utils'),
    assignLocation: jest.fn(),
}));

describe('attemptStorefrontLoginRedirect()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns false and does not redirect if config is not provided', () => {
        expect(attemptStorefrontLoginRedirect(undefined)).toBe(false);
        expect(assignLocation).not.toHaveBeenCalled();
    });

    it('returns false and does not redirect if shouldRedirectToStorefrontForAuth is false', () => {
        const config = getStoreConfig();

        config.checkoutSettings.shouldRedirectToStorefrontForAuth = false;

        expect(attemptStorefrontLoginRedirect(config)).toBe(false);
        expect(assignLocation).not.toHaveBeenCalled();
    });

    it('returns true and redirects to the login link when shouldRedirectToStorefrontForAuth is true', () => {
        const config = getStoreConfig();

        config.checkoutSettings.shouldRedirectToStorefrontForAuth = true;

        expect(attemptStorefrontLoginRedirect(config)).toBe(true);
        expect(assignLocation).toHaveBeenCalledWith(
            `${toStorefrontUrl(config.links.loginLink)}?redirectTo=${toStorefrontUrl(
                config.links.checkoutLink,
            )}`,
        );
    });
});
