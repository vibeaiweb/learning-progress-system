import { useState, useEffect } from 'react';
import { UserButton, useUser } from '@insforge/react';
import { insforge } from '../lib/insforge';
import CourseList from '../components/CourseList';
import AddCourseModal from '../components/AddCourseModal';
import StatsOverview from '../components/StatsOverview';

export default function Dashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'courses' | 'stats'>('courses');
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">學習進度管理系統</h1>
              <p className="text-sm text-gray-600">歡迎回來，{user?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'courses'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              我的課程
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'stats'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              學習統計
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'courses' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">課程列表</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                + 新增課程
              </button>
            </div>
            <CourseList />
          </div>
        )}

        {activeTab === 'stats' && <StatsOverview />}
      </main>

      {/* Add Course Modal */}
      {showAddModal && (
        <AddCourseModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
