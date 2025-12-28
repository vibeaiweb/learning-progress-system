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
    not_started: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
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
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
            {course.category && (
              <span className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                {course.category}
              </span>
            )}
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[progress?.status || 'not_started']}`}>
            {statusLabels[progress?.status || 'not_started']}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {course.description || '沒有描述'}
        </p>

        <div className="space-y-3">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>進度</span>
              <span className="font-medium">{progress?.progress_percentage || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progress?.progress_percentage || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Hours */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">學習時數</span>
            <span className="font-medium text-gray-900">
              {progress?.hours_spent || 0} / {course.target_hours || 0} 小時
            </span>
          </div>
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
