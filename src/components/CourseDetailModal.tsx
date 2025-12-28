import { useState, useEffect } from 'react';
import { useUser } from '@insforge/react';
import { insforge } from '../lib/insforge';

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
}

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface StudySession {
  id: string;
  duration_minutes: number;
  session_date: string;
  notes: string;
}

interface CourseDetailModalProps {
  course: Course;
  progress: LearningProgress;
  onClose: () => void;
  onUpdate: () => void;
}

export default function CourseDetailModal({ course, progress, onClose, onUpdate }: CourseDetailModalProps) {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'progress' | 'notes' | 'sessions'>('progress');
  const [notes, setNotes] = useState<Note[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [newProgress, setNewProgress] = useState(progress?.progress_percentage || 0);
  const [newStatus, setNewStatus] = useState(progress?.status || 'not_started');
  const [sessionDuration, setSessionDuration] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    fetchNotes();
    fetchSessions();
  }, []);

  const fetchNotes = async () => {
    const { data } = await insforge.database
      .from('notes')
      .select('*')
      .eq('course_id', course.id)
      .order('created_at', { ascending: false });
    if (data) setNotes(data);
  };

  const fetchSessions = async () => {
    const { data } = await insforge.database
      .from('study_sessions')
      .select('*')
      .eq('course_id', course.id)
      .order('session_date', { ascending: false });
    if (data) setSessions(data);
  };

  const handleUpdateProgress = async () => {
    if (!user) return;
    await insforge.database
      .from('learning_progress')
      .update({
        progress_percentage: newProgress,
        status: newStatus,
      })
      .eq('course_id', course.id)
      .eq('user_id', user.id);
    onUpdate();
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !sessionDuration) return;

    await insforge.database
      .from('study_sessions')
      .insert([
        {
          course_id: course.id,
          user_id: user.id,
          duration_minutes: parseInt(sessionDuration),
          session_date: new Date().toISOString().split('T')[0],
          notes: sessionNotes,
        },
      ]);

    setSessionDuration('');
    setSessionNotes('');
    fetchSessions();
    onUpdate();
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !noteTitle) return;

    await insforge.database
      .from('notes')
      .insert([
        {
          course_id: course.id,
          user_id: user.id,
          title: noteTitle,
          content: noteContent,
        },
      ]);

    setNoteTitle('');
    setNoteContent('');
    fetchNotes();
  };

  const handleDeleteCourse = async () => {
    if (!confirm('確定要刪除這門課程嗎？此操作無法復原。')) return;

    await insforge.database.from('courses').delete().eq('id', course.id);
    onUpdate();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
            <p className="text-gray-600 mt-1">{course.description}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex px-6">
            <button
              onClick={() => setActiveTab('progress')}
              className={`py-4 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'progress'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              學習進度
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-4 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'notes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              學習筆記
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`py-4 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'sessions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              學習記錄
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'progress' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  進度百分比：{newProgress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newProgress}
                  onChange={(e) => setNewProgress(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">狀態</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="not_started">未開始</option>
                  <option value="in_progress">進行中</option>
                  <option value="completed">已完成</option>
                </select>
              </div>
              <button
                onClick={handleUpdateProgress}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                更新進度
              </button>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-6">
              <form onSubmit={handleAddNote} className="space-y-4 pb-4 border-b">
                <input
                  type="text"
                  placeholder="筆記標題"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <textarea
                  placeholder="筆記內容..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                  新增筆記
                </button>
              </form>
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900">{note.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{note.content}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(note.created_at).toLocaleDateString('zh-TW')}
                    </p>
                  </div>
                ))}
                {notes.length === 0 && <p className="text-gray-500 text-center py-8">還沒有筆記</p>}
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-6">
              <form onSubmit={handleAddSession} className="space-y-4 pb-4 border-b">
                <input
                  type="number"
                  placeholder="學習時間（分鐘）"
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                  min="1"
                />
                <input
                  type="text"
                  placeholder="備註（選填）"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                  記錄學習時間
                </button>
              </form>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">{session.duration_minutes} 分鐘</p>
                      {session.notes && <p className="text-sm text-gray-600">{session.notes}</p>}
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(session.session_date).toLocaleDateString('zh-TW')}
                    </p>
                  </div>
                ))}
                {sessions.length === 0 && <p className="text-gray-500 text-center py-8">還沒有學習記錄</p>}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-between">
          <button
            onClick={handleDeleteCourse}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            刪除課程
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}
