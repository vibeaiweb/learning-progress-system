import { useState, useEffect } from 'react';
import { useUser } from '@insforge/react';
import { insforge } from '../lib/insforge';

interface Stats {
  totalCourses: number;
  inProgressCourses: number;
  completedCourses: number;
  totalHours: number;
  averageProgress: number;
}

export default function StatsOverview() {
  const { user } = useUser();
  const [stats, setStats] = useState<Stats>({
    totalCourses: 0,
    inProgressCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    averageProgress: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      // Fetch all learning progress
      const { data: progressData } = await insforge.database
        .from('learning_progress')
        .select('*, courses(*)')
        .eq('user_id', user.id);

      if (progressData) {
        const totalCourses = progressData.length;
        const inProgressCourses = progressData.filter((p) => p.status === 'in_progress').length;
        const completedCourses = progressData.filter((p) => p.status === 'completed').length;
        const totalHours = progressData.reduce((sum, p) => sum + parseFloat(p.hours_spent || 0), 0);
        const averageProgress = totalCourses > 0
          ? progressData.reduce((sum, p) => sum + p.progress_percentage, 0) / totalCourses
          : 0;

        setStats({
          totalCourses,
          inProgressCourses,
          completedCourses,
          totalHours: Math.round(totalHours * 10) / 10,
          averageProgress: Math.round(averageProgress),
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">學習統計總覽</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Courses */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">總課程數</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCourses}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">進行中</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.inProgressCourses}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">已完成</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.completedCourses}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Hours */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">總學習時數</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalHours}</p>
              <p className="text-xs text-gray-500 mt-1">小時</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Average Progress */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">平均學習進度</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all"
                style={{ width: `${stats.averageProgress}%` }}
              ></div>
            </div>
          </div>
          <span className="text-2xl font-bold text-gray-900">{stats.averageProgress}%</span>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">
          {stats.completedCourses > 0
            ? `🎉 太棒了！你已經完成了 ${stats.completedCourses} 門課程！`
            : '💪 開始你的學習旅程吧！'}
        </h3>
        <p className="text-blue-100">
          {stats.inProgressCourses > 0
            ? `繼續加油，你正在學習 ${stats.inProgressCourses} 門課程`
            : '點擊「我的課程」開始新的學習計畫'}
        </p>
      </div>
    </div>
  );
}
