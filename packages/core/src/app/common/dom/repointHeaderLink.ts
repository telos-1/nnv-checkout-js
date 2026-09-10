import { toStorefrontUrl } from '@bigcommerce/checkout/utility';

/**
 * The checkout banner — the black bar carrying the brand mark in the top left —
 * is rendered server-side by BigCommerce, outside the React tree this bundle
 * mounts. Its anchor is built from the store's canonical URL, so on a store
 * whose canonical URL is not the branded domain the logo takes shoppers off it.
 *
 * `config.links` is repointed at the storefront in `toStorefrontUrl`, but that
 * only reaches links this bundle renders. This one has to be corrected in place
 * on the DOM we were handed.
 *
 * Best-effort by design: the banner can be absent entirely (embedded checkout
 * renders no header), and a logo that already points at the storefront is left
 * as it is because the rewrite is idempotent.
 */
export default function repointHeaderLink(container: ParentNode = document): void {
    const links = container.querySelectorAll<HTMLAnchorElement>('.checkoutHeader-link');

    links.forEach((link) => {
        // Read the attribute rather than `link.href`, which resolves relative
        // values against the current page and would turn them absolute.
        const href = link.getAttribute('href');

        if (!href) {
            return;
        }

        link.setAttribute('href', toStorefrontUrl(href));
    });
}
