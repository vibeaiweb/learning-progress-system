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
        <div className="neo-card p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-neo border-neo-black animate-spin">
              <div className="w-full h-full bg-neo-yellow"></div>
            </div>
            <p className="font-heading text-lg uppercase">載入中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="font-heading text-2xl uppercase">學習統計總覽</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Total Courses */}
        <div className="neo-card p-6 bg-neo-yellow">
          <div className="border-b-neo border-neo-black pb-4 mb-4">
            <p className="font-heading text-sm uppercase">總課程數</p>
          </div>
          <p className="font-heading text-5xl uppercase">{stats.totalCourses}</p>
        </div>

        {/* In Progress */}
        <div className="neo-card p-6 bg-neo-cyan">
          <div className="border-b-neo border-neo-black pb-4 mb-4">
            <p className="font-heading text-sm uppercase">進行中</p>
          </div>
          <p className="font-heading text-5xl uppercase">{stats.inProgressCourses}</p>
        </div>

        {/* Completed */}
        <div className="neo-card p-6 bg-neo-magenta text-neo-white">
          <div className="border-b-neo border-neo-white pb-4 mb-4">
            <p className="font-heading text-sm uppercase">已完成</p>
          </div>
          <p className="font-heading text-5xl uppercase">{stats.completedCourses}</p>
        </div>

        {/* Total Hours */}
        <div className="neo-card p-6 bg-neo-white">
          <div className="border-b-neo border-neo-black pb-4 mb-4">
            <p className="font-heading text-sm uppercase">總學習時數</p>
          </div>
          <p className="font-heading text-5xl uppercase">{stats.totalHours}</p>
          <p className="font-body font-bold text-xs uppercase mt-2">HOURS</p>
        </div>
      </div>

      {/* Average Progress */}
      <div className="neo-card p-8 bg-neo-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-heading text-xl uppercase">平均學習進度</h3>
          <span className="font-heading text-4xl uppercase">{stats.averageProgress}%</span>
        </div>
        <div className="neo-progress h-12">
          <div
            className="neo-progress-bar"
            style={{ width: `${stats.averageProgress}%` }}
          />
        </div>
      </div>

      {/* Motivational Message */}
      <div className="neo-card p-8 bg-neo-cyan">
        <div className="border-neo border-neo-black bg-neo-black text-neo-white p-6 inline-block mb-4">
          <h3 className="font-heading text-2xl uppercase">
            {stats.completedCourses > 0
              ? `🎉 太棒了！已完成 ${stats.completedCourses} 門課程！`
              : '💪 開始你的學習旅程吧！'}
          </h3>
        </div>
        <p className="font-body font-bold text-lg">
          {stats.inProgressCourses > 0
            ? `正在學習 ${stats.inProgressCourses} 門課程 - 繼續加油！`
            : '點擊「我的課程」開始新的學習計畫'}
        </p>
      </div>

      {/* Fun Stats */}
      {stats.totalCourses > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="neo-card p-6 text-center">
            <div className="border-neo border-neo-black bg-neo-yellow px-4 py-2 inline-block mb-4">
              <p className="font-heading text-3xl uppercase">
                {Math.round((stats.completedCourses / stats.totalCourses) * 100)}%
              </p>
            </div>
            <p className="font-heading text-sm uppercase">完成率</p>
          </div>

          <div className="neo-card p-6 text-center">
            <div className="border-neo border-neo-black bg-neo-cyan px-4 py-2 inline-block mb-4">
              <p className="font-heading text-3xl uppercase">
                {stats.totalCourses > 0 ? Math.round(stats.totalHours / stats.totalCourses) : 0}
              </p>
            </div>
            <p className="font-heading text-sm uppercase">平均時數/課程</p>
          </div>

          <div className="neo-card p-6 text-center">
            <div className="border-neo border-neo-black bg-neo-magenta text-neo-white px-4 py-2 inline-block mb-4">
              <p className="font-heading text-3xl uppercase">
                {stats.inProgressCourses}
              </p>
            </div>
            <p className="font-heading text-sm uppercase">活躍課程</p>
          </div>
        </div>
      )}
    </div>
  );
}
