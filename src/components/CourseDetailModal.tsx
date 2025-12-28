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
    <div className="fixed inset-0 bg-neo-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="w-full max-w-4xl my-8">
        <div className="neo-card bg-neo-white">
          {/* Header */}
          <div className="flex justify-between items-start p-8 pb-6 border-b-neo border-neo-black bg-neo-cyan">
            <div className="flex-1">
              <h2 className="font-heading text-3xl uppercase mb-2">{course.title}</h2>
              <p className="font-body font-bold text-sm">{course.description}</p>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 border-neo border-neo-black bg-neo-magenta text-neo-white font-heading text-2xl hover:bg-neo-black transition-colors ml-4"
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b-neo border-neo-black bg-neo-white">
            <nav className="flex gap-2 px-8">
              {(['progress', 'notes', 'sessions'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-heading text-sm uppercase font-black border-b-neo transition-all ${
                    activeTab === tab
                      ? 'bg-neo-yellow border-neo-black translate-y-[4px]'
                      : 'bg-neo-white border-transparent hover:bg-gray-100'
                  }`}
                >
                  {tab === 'progress' && '進度'}
                  {tab === 'notes' && '筆記'}
                  {tab === 'sessions' && '記錄'}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-8 max-h-96 overflow-y-auto">
            {activeTab === 'progress' && (
              <div className="space-y-6">
                <div>
                  <label className="block font-heading text-sm uppercase mb-4">
                    進度：{newProgress}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newProgress}
                    onChange={(e) => setNewProgress(parseInt(e.target.value))}
                    className="w-full h-8 border-neo border-neo-black bg-neo-white appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #FFED4E 0%, #FFED4E ${newProgress}%, #FFFFFF ${newProgress}%, #FFFFFF 100%)`
                    }}
                  />
                </div>
                <div>
                  <label className="block font-heading text-sm uppercase mb-2">狀態</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="neo-select w-full"
                  >
                    <option value="not_started">未開始</option>
                    <option value="in_progress">進行中</option>
                    <option value="completed">已完成</option>
                  </select>
                </div>
                <button
                  onClick={handleUpdateProgress}
                  className="neo-btn-primary w-full"
                >
                  更新進度
                </button>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-6">
                <form onSubmit={handleAddNote} className="space-y-4 pb-6 border-b-neo border-neo-black">
                  <input
                    type="text"
                    placeholder="筆記標題"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="neo-input w-full"
                    required
                  />
                  <textarea
                    placeholder="筆記內容..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="neo-textarea w-full"
                  />
                  <button type="submit" className="neo-btn-secondary w-full">
                    新增筆記
                  </button>
                </form>
                <div className="space-y-4">
                  {notes.map((note) => (
                    <div key={note.id} className="neo-card p-4 bg-neo-yellow">
                      <h4 className="font-heading text-lg uppercase mb-2">{note.title}</h4>
                      <p className="font-body font-bold text-sm mb-2">{note.content}</p>
                      <p className="font-body font-bold text-xs opacity-60">
                        {new Date(note.created_at).toLocaleDateString('zh-TW')}
                      </p>
                    </div>
                  ))}
                  {notes.length === 0 && (
                    <div className="neo-card p-8 text-center">
                      <p className="font-heading text-lg uppercase">還沒有筆記</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'sessions' && (
              <div className="space-y-6">
                <form onSubmit={handleAddSession} className="space-y-4 pb-6 border-b-neo border-neo-black">
                  <input
                    type="number"
                    placeholder="學習時間（分鐘）"
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(e.target.value)}
                    className="neo-input w-full"
                    required
                    min="1"
                  />
                  <input
                    type="text"
                    placeholder="備註（選填）"
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    className="neo-input w-full"
                  />
                  <button type="submit" className="neo-btn-secondary w-full">
                    記錄學習時間
                  </button>
                </form>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="neo-card p-4 bg-neo-cyan flex justify-between items-center">
                      <div>
                        <p className="font-heading text-xl uppercase">{session.duration_minutes} 分鐘</p>
                        {session.notes && <p className="font-body font-bold text-sm">{session.notes}</p>}
                      </div>
                      <p className="font-body font-bold text-sm">
                        {new Date(session.session_date).toLocaleDateString('zh-TW')}
                      </p>
                    </div>
                  ))}
                  {sessions.length === 0 && (
                    <div className="neo-card p-8 text-center">
                      <p className="font-heading text-lg uppercase">還沒有學習記錄</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-8 border-t-neo border-neo-black flex justify-between bg-neo-white">
            <button
              onClick={handleDeleteCourse}
              className="neo-btn-danger"
            >
              刪除課程
            </button>
            <button
              onClick={onClose}
              className="neo-btn"
            >
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
