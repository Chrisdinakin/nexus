export default function AdminLayout({ children, user, onLogout }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                NEXUS CMS
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Welcome, {user?.username}</span>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                View Site
              </a>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
