import toStorefrontUrl, { STOREFRONT_ORIGIN } from './toStorefrontUrl';

describe('toStorefrontUrl', () => {
    it('repoints a BigCommerce store URL at the storefront', () => {
        expect(toStorefrontUrl('https://store-abc123.mybigcommerce.com/cart.php')).toBe(
            `${STOREFRONT_ORIGIN}/cart.php`,
        );
    });

    it('keeps the query string intact', () => {
        expect(
            toStorefrontUrl(
                'https://store-abc123.mybigcommerce.com/login.php?redirectTo=%2Fcheckout',
            ),
        ).toBe(`${STOREFRONT_ORIGIN}/login.php?redirectTo=%2Fcheckout`);
    });

    it('keeps the fragment intact', () => {
        expect(toStorefrontUrl('https://store-abc123.mybigcommerce.com/#/invoice')).toBe(
            `${STOREFRONT_ORIGIN}/#/invoice`,
        );
    });

    it('does not add a trailing slash to an origin-only URL', () => {
        expect(toStorefrontUrl('https://store-abc123.mybigcommerce.com')).toBe(STOREFRONT_ORIGIN);
    });

    it('drops a non-default port along with the host', () => {
        expect(toStorefrontUrl('http://localhost:3000/cart.php')).toBe(
            `${STOREFRONT_ORIGIN}/cart.php`,
        );
    });

    it('upgrades an insecure store URL', () => {
        expect(toStorefrontUrl('http://store-abc123.mybigcommerce.com/cart.php')).toBe(
            `${STOREFRONT_ORIGIN}/cart.php`,
        );
    });

    it('is idempotent for a URL already on the storefront', () => {
        expect(toStorefrontUrl(`${STOREFRONT_ORIGIN}/cart.php`)).toBe(
            `${STOREFRONT_ORIGIN}/cart.php`,
        );
    });

    it('leaves a relative link alone', () => {
        expect(toStorefrontUrl('/cart.php')).toBe('/cart.php');
    });

    it('leaves an empty string alone', () => {
        expect(toStorefrontUrl('')).toBe('');
    });

    it('leaves a URL without a meaningful host alone', () => {
        expect(toStorefrontUrl('data:text/plain,hello')).toBe('data:text/plain,hello');
    });
});
