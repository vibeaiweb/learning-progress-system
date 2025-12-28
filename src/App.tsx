import { SignedIn, SignedOut, SignInButton, SignUpButton, useUser } from '@insforge/react';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">學習進度管理系統</h1>
              <p className="text-gray-600">追蹤你的學習旅程，記錄每一步成長</p>
            </div>
            <div className="space-y-4">
              <SignInButton className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                登入帳號
              </SignInButton>
              <SignUpButton className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors font-medium">
                註冊新帳號
              </SignUpButton>
            </div>
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>支援 Email 或 Google 登入</p>
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
