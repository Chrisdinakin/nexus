import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏆</span>
              <span className="text-xl font-bold tracking-wider font-heading">ATHLETIX</span>
            </Link>
            <p className="text-sm text-text-grey leading-relaxed mb-4">
              Gear Up. Game On. Premium sports gear for every athlete. From footwear to equipment, we have everything you need to perform at your best.
            </p>
            <div className="flex gap-4">
              {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map(social => (
                <a key={social} href="#" className="text-text-grey hover:text-accent-orange transition-colors text-sm">
                  {social === 'Facebook' && '📘'}
                  {social === 'Twitter' && '🐦'}
                  {social === 'Instagram' && '📸'}
                  {social === 'YouTube' && '📺'}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: 'Shop All', href: '/shop' },
                { name: 'New Arrivals', href: '/shop?badge=NEW' },
                { name: 'Deals & Offers', href: '/shop?badge=SALE' },
                { name: 'Bestsellers', href: '/shop?badge=BESTSELLER' },
                { name: 'Size Guide', href: '/faq' },
              ].map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-text-grey hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Customer Service</h4>
            <ul className="space-y-2">
              {[
                { name: 'Contact Us', href: '/contact' },
                { name: 'FAQ / Help Center', href: '/faq' },
                { name: 'Shipping & Returns', href: '/faq' },
                { name: 'Privacy Policy', href: '/faq' },
                { name: 'Terms & Conditions', href: '/faq' },
              ].map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-text-grey hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Stay in the Game</h4>
            <p className="text-sm text-text-grey mb-4">Subscribe for exclusive deals, new arrivals, and athlete tips.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange"
              />
              <button className="bg-accent-orange hover:bg-accent-orange/80 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                Join
              </button>
            </div>
            <div className="mt-6 flex items-center gap-4 text-xs text-text-grey">
              <span>🔒 Secure Payments</span>
              <span>🚚 Free Shipping $50+</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-grey">© 2026 ATHLETIX. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/about" className="text-xs text-text-grey hover:text-white transition-colors">About Us</Link>
            <Link href="/faq" className="text-xs text-text-grey hover:text-white transition-colors">Privacy</Link>
            <Link href="/faq" className="text-xs text-text-grey hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
