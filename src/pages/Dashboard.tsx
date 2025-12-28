import { useState } from 'react';
import { UserButton, useUser } from '@insforge/react';
import CourseList from '../components/CourseList';
import AddCourseModal from '../components/AddCourseModal';
import StatsOverview from '../components/StatsOverview';

export default function Dashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'courses' | 'stats'>('courses');
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="min-h-screen bg-neo-white">
      {/* Header */}
      <header className="border-b-neo border-neo-black bg-neo-yellow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl uppercase mb-2">
                學習系統
              </h1>
              <p className="font-body font-bold text-sm">
                {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="neo-card px-4 py-2">
                <UserButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b-neo border-neo-black bg-neo-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-2">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-6 py-4 font-heading text-sm uppercase font-black border-b-neo transition-all ${
                activeTab === 'courses'
                  ? 'bg-neo-cyan border-neo-black translate-y-[4px]'
                  : 'bg-neo-white border-transparent hover:bg-gray-100'
              }`}
            >
              我的課程
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-4 font-heading text-sm uppercase font-black border-b-neo transition-all ${
                activeTab === 'stats'
                  ? 'bg-neo-cyan border-neo-black translate-y-[4px]'
                  : 'bg-neo-white border-transparent hover:bg-gray-100'
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
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-heading text-2xl uppercase">課程列表</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="neo-btn-primary"
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
