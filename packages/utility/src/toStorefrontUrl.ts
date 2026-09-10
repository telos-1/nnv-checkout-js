/**
 * The storefront this checkout belongs to.
 *
 * Every link back to the store — the cart, sign in, create account, forgot
 * password, log out, continue shopping — is handed to us by BigCommerce in
 * `config.links`, built from the store's canonical URL rather than from the
 * domain the shopper is actually on. When those differ, a shopper who clicks
 * "Edit cart" is taken off the branded domain and onto the BigCommerce one.
 *
 * Rewriting the origin here keeps every one of those links on the storefront.
 */
export const STOREFRONT_ORIGIN = 'https://nuggetsnightvision.com';

/**
 * Repoints an absolute store URL at {@link STOREFRONT_ORIGIN}, keeping its path,
 * query and fragment exactly as they were — `/cart.php`, `/login.php`, the
 * `?redirectTo=` a login round trip depends on.
 *
 * Anything without an origin of its own is returned untouched: a relative link
 * already resolves against whatever host the shopper is on, and an empty string
 * is how the callers spell "the store didn't give us this link".
 */
export default function toStorefrontUrl(url: string): string {
    if (!url) {
        return url;
    }

    let origin;

    try {
        ({ origin } = new URL(url));
    } catch {
        return url;
    }

    // `origin` is "null" for URLs that have no meaningful host — `data:`,
    // `blob:` and friends. There is nothing to repoint in those.
    if (origin === 'null') {
        return url;
    }

    return `${STOREFRONT_ORIGIN}${url.slice(origin.length)}`;
}
