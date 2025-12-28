import { SignedIn, SignedOut, SignInButton, SignUpButton, useUser } from '@insforge/react';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neo-white">
        <div className="neo-card p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-neo border-neo-black animate-spin">
              <div className="w-full h-full bg-neo-yellow"></div>
            </div>
            <p className="font-heading text-xl uppercase">載入中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neo-white">
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center p-4"
             style={{
               backgroundImage: `
                 repeating-linear-gradient(0deg, #000 0px, #000 2px, transparent 2px, transparent 20px),
                 repeating-linear-gradient(90deg, #000 0px, #000 2px, transparent 2px, transparent 20px)
               `,
               backgroundColor: '#FFED4E'
             }}>
          <div className="w-full max-w-xl">
            <div className="neo-card p-8 md:p-12 bg-neo-white">
              <div className="text-center mb-8">
                <div className="inline-block border-neo border-neo-black bg-neo-cyan px-6 py-2 mb-6">
                  <h1 className="font-heading text-4xl md:text-5xl uppercase">
                    學習系統
                  </h1>
                </div>
                <p className="font-body text-lg font-bold">
                  追蹤進度 · 記錄成長 · 達成目標
                </p>
              </div>

              <div className="space-y-4">
                <SignInButton className="neo-btn-primary w-full">
                  登入帳號
                </SignInButton>
                <SignUpButton className="neo-btn-secondary w-full">
                  註冊新帳號
                </SignUpButton>
              </div>

              <div className="mt-8 pt-6 border-t-neo border-neo-black">
                <div className="flex items-center justify-center gap-4">
                  <div className="w-8 h-8 border-neo border-neo-black bg-neo-magenta"></div>
                  <p className="font-body font-bold text-sm uppercase">
                    Email / Google OAuth
                  </p>
                  <div className="w-8 h-8 border-neo border-neo-black bg-neo-cyan"></div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-block border-neo border-neo-black bg-neo-white px-4 py-2 shadow-neo">
                <p className="font-body font-bold text-sm">
                  NEO-BRUTALISM DESIGN © 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <Dashboard />
      </SignedIn>
    </div>
  );
}

export default App;
