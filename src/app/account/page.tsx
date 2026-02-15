'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth, Order } from '@/lib/auth-context';
import { products } from '@/data/products';

type Tab = 'profile' | 'orders' | 'wishlist' | 'addresses' | 'settings';

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, logout, updateProfile, changePassword, orders, addAddress, removeAddress, setDefaultAddress, toggleWishlist } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  // Profile editing
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', phone: '' });

  // Password change
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: '', address: '', city: '', state: '', zip: '', country: 'US', isDefault: false,
  });

  // Sync tab from URL
  useEffect(() => {
    const tab = searchParams.get('tab') as Tab | null;
    if (tab && ['profile', 'orders', 'wishlist', 'addresses', 'settings'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Sync profile form when user loads
  useEffect(() => {
    if (user) {
      setProfileForm({ firstName: user.firstName, lastName: user.lastName, phone: user.phone });
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <p className="text-6xl mb-4">🔒</p>
          <h1 className="text-2xl font-bold font-heading mb-3">SIGN IN REQUIRED</h1>
          <p className="text-text-grey mb-6">Please sign in to access your account.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/login" className="bg-accent-orange hover:bg-accent-orange/80 text-white px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all">
              Sign In
            </Link>
            <Link href="/register" className="border border-border hover:border-white/30 text-white px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const changeTab = (tab: Tab) => {
    setActiveTab(tab);
    router.push(`/account?tab=${tab}`, { scroll: false });
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'wishlist', label: 'Wishlist', icon: '❤️' },
    { id: 'addresses', label: 'Addresses', icon: '📍' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleSaveProfile = () => {
    updateProfile(profileForm);
    setEditingProfile(false);
  };

  const handleChangePassword = async () => {
    setPasswordMsg(null);
    if (passwordForm.newPass !== passwordForm.confirm) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    const result = await changePassword(passwordForm.current, passwordForm.newPass);
    if (result.success) {
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setPasswordForm({ current: '', newPass: '', confirm: '' });
    } else {
      setPasswordMsg({ type: 'error', text: result.error || 'Failed to change password' });
    }
  };

  const handleAddAddress = () => {
    if (!addressForm.label || !addressForm.address || !addressForm.city || !addressForm.state || !addressForm.zip) return;
    addAddress(addressForm);
    setAddressForm({ label: '', address: '', city: '', state: '', zip: '', country: 'US', isDefault: false });
    setShowAddressForm(false);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'processing': return 'text-accent-blue bg-accent-blue/10';
      case 'shipped': return 'text-accent-orange bg-accent-orange/10';
      case 'delivered': return 'text-accent-green bg-accent-green/10';
      case 'cancelled': return 'text-danger bg-danger/10';
    }
  };

  const wishlistProducts = products.filter(p => user.wishlist.includes(p.id));

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-accent-orange/20 border-2 border-accent-orange/40 flex items-center justify-center text-2xl font-bold text-accent-orange uppercase">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading">{user.firstName} {user.lastName}</h1>
            <p className="text-sm text-text-grey">Member since {memberSince}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); router.push('/'); }}
          className="hidden sm:flex items-center gap-2 text-sm text-text-grey hover:text-danger transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl overflow-hidden sticky top-24">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => changeTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-accent-orange/10 text-accent-orange border-l-2 border-accent-orange'
                    : 'text-text-grey hover:text-white hover:bg-secondary'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
                {tab.id === 'orders' && orders.length > 0 && (
                  <span className="ml-auto bg-accent-orange/20 text-accent-orange text-xs px-2 py-0.5 rounded-full">{orders.length}</span>
                )}
                {tab.id === 'wishlist' && user.wishlist.length > 0 && (
                  <span className="ml-auto bg-danger/20 text-danger text-xs px-2 py-0.5 rounded-full">{user.wishlist.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">Profile Information</h2>
                  <button
                    onClick={() => setEditingProfile(!editingProfile)}
                    className="text-sm text-accent-orange hover:text-accent-orange/80 transition-colors"
                  >
                    {editingProfile ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {editingProfile ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-text-grey mb-1">First Name</label>
                        <input
                          value={profileForm.firstName}
                          onChange={e => setProfileForm(p => ({ ...p, firstName: e.target.value }))}
                          className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-orange"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-text-grey mb-1">Last Name</label>
                        <input
                          value={profileForm.lastName}
                          onChange={e => setProfileForm(p => ({ ...p, lastName: e.target.value }))}
                          className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-orange"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-text-grey mb-1">Phone</label>
                      <input
                        value={profileForm.phone}
                        onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                        placeholder="(555) 123-4567"
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange"
                      />
                    </div>
                    <button
                      onClick={handleSaveProfile}
                      className="bg-accent-orange hover:bg-accent-orange/80 text-white px-6 py-2.5 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-text-grey mb-1">Full Name</p>
                      <p className="text-sm font-semibold">{user.firstName} {user.lastName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-grey mb-1">Email</p>
                      <p className="text-sm font-semibold">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-grey mb-1">Phone</p>
                      <p className="text-sm font-semibold">{user.phone || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-grey mb-1">Member Since</p>
                      <p className="text-sm font-semibold">{memberSince}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Orders', value: orders.length, icon: '📦' },
                  { label: 'Wishlist', value: user.wishlist.length, icon: '❤️' },
                  { label: 'Addresses', value: user.addresses.length, icon: '📍' },
                  { label: 'Total Spent', value: `$${orders.reduce((s, o) => s + o.total, 0).toFixed(0)}`, icon: '💰' },
                ].map(stat => (
                  <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center">
                    <p className="text-2xl mb-1">{stat.icon}</p>
                    <p className="text-lg font-bold font-mono">{stat.value}</p>
                    <p className="text-xs text-text-grey">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold">Order History</h2>
              {orders.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-12 text-center">
                  <p className="text-4xl mb-3">📦</p>
                  <p className="text-lg font-semibold mb-2">No Orders Yet</p>
                  <p className="text-sm text-text-grey mb-4">Start shopping to see your orders here.</p>
                  <Link href="/shop" className="text-accent-orange hover:text-accent-orange/80 text-sm font-semibold">
                    Browse Products →
                  </Link>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-semibold text-sm">Order {order.id}</p>
                        <p className="text-xs text-text-grey">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className="text-sm font-bold font-mono">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm py-1 border-t border-border first:border-0">
                          <div className="flex items-center gap-2">
                            <span className="text-text-grey">{item.quantity}×</span>
                            <span>{item.name}</span>
                            <span className="text-xs text-text-grey">({item.size})</span>
                          </div>
                          <span className="font-mono text-text-grey">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-text-grey">
                      <span>Paid via {order.paymentMethod}</span>
                      {order.trackingNumber && <span>Tracking: {order.trackingNumber}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold">Wishlist</h2>
              {wishlistProducts.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-12 text-center">
                  <p className="text-4xl mb-3">❤️</p>
                  <p className="text-lg font-semibold mb-2">Wishlist is Empty</p>
                  <p className="text-sm text-text-grey mb-4">Save items you love for later.</p>
                  <Link href="/shop" className="text-accent-orange hover:text-accent-orange/80 text-sm font-semibold">
                    Browse Products →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistProducts.map(product => (
                    <div key={product.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                      <Link href={`/product/${product.id}`} className="w-20 h-20 bg-secondary rounded-lg shrink-0 flex items-center justify-center text-3xl">
                        🏃
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${product.id}`} className="text-sm font-semibold hover:text-accent-orange transition-colors line-clamp-1">
                          {product.name}
                        </Link>
                        <p className="text-xs text-text-grey">{product.brand}</p>
                        <p className="text-sm font-bold font-mono mt-1">${product.price.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                        title="Remove from wishlist"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Saved Addresses</h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-sm text-accent-orange hover:text-accent-orange/80 font-semibold transition-colors"
                >
                  {showAddressForm ? 'Cancel' : '+ Add Address'}
                </button>
              </div>

              {showAddressForm && (
                <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                  <input
                    placeholder="Label (e.g. Home, Office)"
                    value={addressForm.label}
                    onChange={e => setAddressForm(p => ({ ...p, label: e.target.value }))}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange"
                  />
                  <input
                    placeholder="Street Address"
                    value={addressForm.address}
                    onChange={e => setAddressForm(p => ({ ...p, address: e.target.value }))}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      placeholder="City"
                      value={addressForm.city}
                      onChange={e => setAddressForm(p => ({ ...p, city: e.target.value }))}
                      className="bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange"
                    />
                    <input
                      placeholder="State"
                      value={addressForm.state}
                      onChange={e => setAddressForm(p => ({ ...p, state: e.target.value }))}
                      className="bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange"
                    />
                    <input
                      placeholder="ZIP"
                      value={addressForm.zip}
                      onChange={e => setAddressForm(p => ({ ...p, zip: e.target.value }))}
                      className="bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={e => setAddressForm(p => ({ ...p, isDefault: e.target.checked }))}
                      className="accent-accent-orange"
                    />
                    <span className="text-sm text-text-grey">Set as default address</span>
                  </label>
                  <button
                    onClick={handleAddAddress}
                    className="bg-accent-orange hover:bg-accent-orange/80 text-white px-6 py-2.5 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all"
                  >
                    Save Address
                  </button>
                </div>
              )}

              {user.addresses.length === 0 && !showAddressForm ? (
                <div className="bg-card border border-border rounded-xl p-12 text-center">
                  <p className="text-4xl mb-3">📍</p>
                  <p className="text-lg font-semibold mb-2">No Saved Addresses</p>
                  <p className="text-sm text-text-grey">Add an address for faster checkout.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.addresses.map(addr => (
                    <div key={addr.id} className={`bg-card border rounded-xl p-4 relative ${addr.isDefault ? 'border-accent-orange' : 'border-border'}`}>
                      {addr.isDefault && (
                        <span className="absolute top-3 right-3 text-xs bg-accent-orange/20 text-accent-orange px-2 py-0.5 rounded-full font-semibold">Default</span>
                      )}
                      <p className="font-semibold text-sm mb-1">{addr.label}</p>
                      <p className="text-sm text-text-grey">{addr.address}</p>
                      <p className="text-sm text-text-grey">{addr.city}, {addr.state} {addr.zip}</p>
                      <div className="flex gap-2 mt-3">
                        {!addr.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-xs text-accent-orange hover:text-accent-orange/80 transition-colors"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => removeAddress(addr.id)}
                          className="text-xs text-danger hover:text-danger/80 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-bold mb-6">Change Password</h2>
                <div className="space-y-4 max-w-md">
                  {passwordMsg && (
                    <div className={`p-3 rounded-lg text-sm ${passwordMsg.type === 'success' ? 'bg-accent-green/10 border border-accent-green/20 text-accent-green' : 'bg-danger/10 border border-danger/20 text-danger'}`}>
                      {passwordMsg.text}
                    </div>
                  )}
                  <div>
                    <label className="block text-xs text-text-grey mb-1">Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.current}
                      onChange={e => setPasswordForm(p => ({ ...p, current: e.target.value }))}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-grey mb-1">New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPass}
                      onChange={e => setPasswordForm(p => ({ ...p, newPass: e.target.value }))}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-grey mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirm}
                      onChange={e => setPasswordForm(p => ({ ...p, confirm: e.target.value }))}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-orange"
                    />
                  </div>
                  <button
                    onClick={handleChangePassword}
                    className="bg-accent-orange hover:bg-accent-orange/80 text-white px-6 py-2.5 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all"
                  >
                    Update Password
                  </button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-bold mb-2">Account</h2>
                <p className="text-sm text-text-grey mb-4">Manage your account preferences.</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="text-sm font-semibold">Email</p>
                      <p className="text-xs text-text-grey">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="text-sm font-semibold">Data Storage</p>
                      <p className="text-xs text-text-grey">All data is stored locally in your browser</p>
                    </div>
                    <span className="text-xs bg-accent-green/10 text-accent-green px-2 py-0.5 rounded-full">Local</span>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-danger/20 rounded-xl p-6">
                <h2 className="text-lg font-bold text-danger mb-2">Danger Zone</h2>
                <p className="text-sm text-text-grey mb-4">Sign out of your account.</p>
                <button
                  onClick={() => { logout(); router.push('/'); }}
                  className="bg-danger/10 hover:bg-danger/20 text-danger px-6 py-2.5 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all border border-danger/20"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-orange border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}
