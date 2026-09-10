import { STOREFRONT_ORIGIN } from '@bigcommerce/checkout/utility';

import repointHeaderLink from './repointHeaderLink';

describe('repointHeaderLink()', () => {
    const createHeader = (html: string): HTMLElement => {
        const header = document.createElement('div');

        header.innerHTML = html;

        return header;
    };

    const hrefsIn = (header: HTMLElement): Array<string | null> =>
        Array.from(header.querySelectorAll('a')).map((link) => link.getAttribute('href'));

    it('repoints the logo link at the storefront', () => {
        const header = createHeader(
            '<a class="checkoutHeader-link" href="https://store-k1drp8k8.bcapp.dev/"></a>',
        );

        repointHeaderLink(header);

        expect(hrefsIn(header)).toEqual([`${STOREFRONT_ORIGIN}/`]);
    });

    it('repoints every logo link when the page has more than one', () => {
        const header = createHeader(
            '<a class="checkoutHeader-link" href="https://store-k1drp8k8.bcapp.dev/"></a>' +
                '<a class="checkoutHeader-link" href="https://store-k1drp8k8.bcapp.dev/cart.php"></a>',
        );

        repointHeaderLink(header);

        expect(hrefsIn(header)).toEqual([`${STOREFRONT_ORIGIN}/`, `${STOREFRONT_ORIGIN}/cart.php`]);
    });

    it('leaves a link that already points at the storefront alone', () => {
        const header = createHeader(
            `<a class="checkoutHeader-link" href="${STOREFRONT_ORIGIN}/"></a>`,
        );

        repointHeaderLink(header);

        expect(hrefsIn(header)).toEqual([`${STOREFRONT_ORIGIN}/`]);
    });

    it('leaves a relative link alone rather than making it absolute', () => {
        const header = createHeader('<a class="checkoutHeader-link" href="/"></a>');

        repointHeaderLink(header);

        expect(hrefsIn(header)).toEqual(['/']);
    });

    it('leaves links outside the banner alone', () => {
        const header = createHeader(
            '<a class="some-other-link" href="https://store-k1drp8k8.bcapp.dev/"></a>',
        );

        repointHeaderLink(header);

        expect(hrefsIn(header)).toEqual(['https://store-k1drp8k8.bcapp.dev/']);
    });

    it('ignores a logo link with no href', () => {
        const header = createHeader('<a class="checkoutHeader-link"></a>');

        expect(() => repointHeaderLink(header)).not.toThrow();
        expect(hrefsIn(header)).toEqual([null]);
    });

    it('does nothing when the page has no banner', () => {
        const header = createHeader('<div class="checkoutHeader"></div>');

        expect(() => repointHeaderLink(header)).not.toThrow();
        expect(hrefsIn(header)).toEqual([]);
    });
});
