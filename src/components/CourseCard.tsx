import { useState } from 'react';
import CourseDetailModal from './CourseDetailModal';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  target_hours: number;
}

interface LearningProgress {
  progress_percentage: number;
  hours_spent: number;
  status: 'not_started' | 'in_progress' | 'completed';
  last_studied_at: string | null;
}

interface CourseCardProps {
  course: Course;
  progress: LearningProgress;
  onUpdate: () => void;
}

export default function CourseCard({ course, progress, onUpdate }: CourseCardProps) {
  const [showDetail, setShowDetail] = useState(false);

  const statusColors = {
    not_started: 'bg-gray-200',
    in_progress: 'bg-neo-cyan',
    completed: 'bg-neo-yellow',
  };

  const statusLabels = {
    not_started: '未開始',
    in_progress: '進行中',
    completed: '已完成',
  };

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        className="neo-card-hover p-6"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-heading text-xl uppercase mb-2">{course.title}</h3>
            {course.category && (
              <div className="inline-block border-neo border-neo-black bg-neo-magenta px-3 py-1">
                <span className="font-body text-xs font-bold uppercase text-neo-white">
                  {course.category}
                </span>
              </div>
            )}
          </div>
          <div className={`border-neo border-neo-black px-3 py-1 ${statusColors[progress?.status || 'not_started']}`}>
            <span className="font-body text-xs font-bold uppercase">
              {statusLabels[progress?.status || 'not_started']}
            </span>
          </div>
        </div>

        <p className="font-body font-bold text-sm mb-6 line-clamp-2">
          {course.description || '沒有描述'}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="font-body font-bold text-xs uppercase">進度</span>
            <span className="font-heading text-sm font-black">{progress?.progress_percentage || 0}%</span>
          </div>
          <div className="neo-progress">
            <div
              className="neo-progress-bar"
              style={{ width: `${progress?.progress_percentage || 0}%` }}
            />
          </div>
        </div>

        {/* Hours */}
        <div className="flex justify-between border-t-neo border-neo-black pt-4">
          <span className="font-body font-bold text-xs uppercase">學習時數</span>
          <span className="font-heading text-sm font-black">
            {progress?.hours_spent || 0} / {course.target_hours || 0} HR
          </span>
        </div>
      </div>

      {showDetail && (
        <CourseDetailModal
          course={course}
          progress={progress}
          onClose={() => setShowDetail(false)}
          onUpdate={() => {
            onUpdate();
            setShowDetail(false);
          }}
        />
      )}
    </>
  );
}
