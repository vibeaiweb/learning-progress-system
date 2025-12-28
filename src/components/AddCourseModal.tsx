import { useState } from 'react';
import { useUser } from '@insforge/react';
import { insforge } from '../lib/insforge';

interface AddCourseModalProps {
  onClose: () => void;
}

export default function AddCourseModal({ onClose }: AddCourseModalProps) {
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [targetHours, setTargetHours] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { error: insertError } = await insforge.database
        .from('courses')
        .insert([
          {
            user_id: user.id,
            title,
            description,
            category,
            target_hours: parseInt(targetHours) || 0,
          },
        ])
        .select();

      if (insertError) throw insertError;

      onClose();
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neo-black/80 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl">
        <div className="neo-card p-8 bg-neo-white">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 pb-6 border-b-neo border-neo-black">
            <h2 className="font-heading text-3xl uppercase">新增課程</h2>
            <button
              onClick={onClose}
              className="w-12 h-12 border-neo border-neo-black bg-neo-magenta text-neo-white font-heading text-2xl hover:bg-neo-black transition-colors"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block font-heading text-sm uppercase mb-2">
                課程名稱 *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="neo-input w-full"
                placeholder="例如：JAVASCRIPT 基礎"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-heading text-sm uppercase mb-2">
                課程描述
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="neo-textarea w-full"
                placeholder="簡單描述這門課程..."
              />
            </div>

            {/* Category & Hours Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-heading text-sm uppercase mb-2">
                  課程類別
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="neo-input w-full"
                  placeholder="程式設計"
                />
              </div>

              <div>
                <label className="block font-heading text-sm uppercase mb-2">
                  目標時數
                </label>
                <input
                  type="number"
                  min="0"
                  value={targetHours}
                  onChange={(e) => setTargetHours(e.target.value)}
                  className="neo-input w-full"
                  placeholder="100"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="neo-card bg-neo-magenta p-4">
                <p className="font-body font-bold text-neo-white text-sm">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-4 border-t-neo border-neo-black">
              <button
                type="button"
                onClick={onClose}
                className="neo-btn flex-1"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading}
                className="neo-btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '新增中...' : '新增課程'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
