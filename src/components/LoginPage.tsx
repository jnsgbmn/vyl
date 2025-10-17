// src/components/LoginPage.tsx
import MeshGradientBackground from "./MeshGradientBackground";

interface LoginPageProps {
  authUrl: string;
}

export default function LoginPage({ authUrl }: LoginPageProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen relative text-white flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <MeshGradientBackground albumImageUrl={undefined} />

      <div className="text-center relative z-10 max-w-md px-6 flex-1 flex flex-col justify-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce">
            <img
              src="/Siri.png"
              alt="Vynora Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
          Vyl
        </h1>

        <p className="text-xl text-gray-400 mb-12">
          Your Premium Music Experience
        </p>

        {/* Login Button */}
        <a
          href={authUrl}
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full text-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl shadow-green-500/50"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          Connect with Spotify
        </a>
      </div>

      {/* Copyright Footer */}
      <div className="relative z-10 pb-6 text-center">
        <p className="text-sm text-gray-500">
          © {currentYear} Vyl. All rights reserved
        </p>
        <p className="text-xs text-gray-500 mt-1"> jsgbn</p>
      </div>
    </div>
  );
}
