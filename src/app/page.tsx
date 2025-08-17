export default function HomePage() {
  return (
    <main className="min-h-screen bg-befast-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-befast-text mb-4">
            Welcome to EcoBeFast
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Sustainable delivery platform connecting businesses with eco-friendly drivers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/delivery/login"
              className="bg-befast-primary text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors"
            >
              Business Login
            </a>
            <a 
              href="/drivers/login"
              className="bg-befast-secondary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Driver Login
            </a>
            <a 
              href="/admin/login"
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
            >
              Admin Login
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}