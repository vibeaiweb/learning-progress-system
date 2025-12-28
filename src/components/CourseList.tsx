import { useState, useEffect } from 'react';
import { useUser } from '@insforge/react';
import { insforge } from '../lib/insforge';
import CourseCard from './CourseCard';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  target_hours: number;
  created_at: string;
}

interface LearningProgress {
  progress_percentage: number;
  hours_spent: number;
  status: 'not_started' | 'in_progress' | 'completed';
  last_studied_at: string | null;
}

interface CourseWithProgress extends Course {
  learning_progress: LearningProgress[];
}

export default function CourseList() {
  const { user } = useUser();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await insforge.database
        .from('courses')
        .select('*, learning_progress(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [user]);

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

  if (error) {
    return (
      <div className="neo-card bg-neo-magenta p-6">
        <p className="font-body font-bold text-neo-white">錯誤：{error}</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="neo-card p-12 text-center">
        <div className="inline-block border-neo border-neo-black bg-neo-cyan px-4 py-2 mb-6">
          <p className="font-heading text-2xl uppercase">📚</p>
        </div>
        <h3 className="font-heading text-xl uppercase mb-4">還沒有課程</h3>
        <p className="font-body font-bold text-sm">
          點擊「新增課程」開始你的學習旅程
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          progress={course.learning_progress[0]}
          onUpdate={fetchCourses}
        />
      ))}
    </div>
  );
}
