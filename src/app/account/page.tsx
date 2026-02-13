import Link from 'next/link';

export default function AccountPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl sm:text-5xl font-bold font-heading mb-6">MY ACCOUNT</h1>

      <div className="bg-card border border-border rounded-xl p-8 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-accent-orange/20 flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <h2 className="text-xl font-bold">Guest User</h2>
            <p className="text-sm text-text-grey">Sign in to access your full account</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: '📦', title: 'Order History', desc: 'Track and manage your orders', href: '/shop' },
          { icon: '❤️', title: 'Wishlist', desc: 'Your saved items', href: '/shop' },
          { icon: '📍', title: 'Saved Addresses', desc: 'Manage shipping addresses', href: '/checkout' },
          { icon: '⚙️', title: 'Settings', desc: 'Update your profile', href: '/account' },
        ].map(item => (
          <Link key={item.title} href={item.href} className="bg-card border border-border rounded-xl p-6 hover:border-accent-orange/40 transition-all card-hover">
            <span className="text-3xl mb-3 block">{item.icon}</span>
            <h3 className="font-semibold mb-1">{item.title}</h3>
            <p className="text-sm text-text-grey">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
