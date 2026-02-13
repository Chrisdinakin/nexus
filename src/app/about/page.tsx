import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl sm:text-5xl font-bold font-heading mb-6">ABOUT ATHLETIX</h1>
      <p className="text-accent-orange text-sm uppercase tracking-wider font-semibold mb-8">Gear Up. Game On.</p>

      <div className="space-y-8 text-text-grey leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold font-heading text-white mb-4">OUR MISSION</h2>
          <p>
            At ATHLETIX, we believe every athlete deserves access to premium sports gear that enhances their performance. Whether you&apos;re a weekend warrior, a dedicated gym enthusiast, or a professional competitor, we&apos;re here to equip you with the best.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading text-white mb-4">OUR STORY</h2>
          <p>
            Founded in 2020, ATHLETIX started with a simple idea: make premium sports equipment accessible to everyone. What began as a small online store has grown into a trusted destination for athletes worldwide, offering top brands and curated collections across every sport.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading text-white mb-4">WHY CHOOSE US</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {[
              { icon: '🏆', title: 'Premium Quality', desc: 'We partner with the world\'s leading sports brands to bring you only the best.' },
              { icon: '🚚', title: 'Fast Shipping', desc: 'Free shipping on orders over $50 with express options available.' },
              { icon: '🔄', title: 'Easy Returns', desc: '30-day hassle-free returns on all products.' },
              { icon: '💬', title: '24/7 Support', desc: 'Our team is always here to help you find the perfect gear.' },
            ].map(item => (
              <div key={item.title} className="bg-card border border-border rounded-xl p-6">
                <span className="text-3xl mb-3 block">{item.icon}</span>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center pt-8">
          <Link href="/shop" className="inline-block bg-accent-orange hover:bg-accent-orange/80 text-white px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all">
            Start Shopping
          </Link>
        </section>
      </div>
    </div>
  );
}
