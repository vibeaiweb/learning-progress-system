-- ============================================
-- 學習進度管理系統 - 資料庫結構
-- ============================================

-- 1. 課程表
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_hours INTEGER DEFAULT 0,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 學習進度表
CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  hours_spent NUMERIC(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  last_studied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

-- 3. 學習筆記表
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 學習記錄表（用於統計）
CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_minutes INTEGER NOT NULL,
  session_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 索引 (提升查詢效能)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_courses_user_id ON courses(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_user_id ON learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_course_id ON learning_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_course_id ON notes(course_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_course_id ON study_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_date ON study_sessions(session_date);

-- ============================================
-- RLS (Row Level Security) 政策
-- ============================================

-- 啟用 RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- courses 表的 RLS 政策
CREATE POLICY "用戶只能查看自己的課程"
  ON courses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "用戶只能新增自己的課程"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用戶只能更新自己的課程"
  ON courses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用戶只能刪除自己的課程"
  ON courses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- learning_progress 表的 RLS 政策
CREATE POLICY "用戶只能查看自己的學習進度"
  ON learning_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "用戶只能新增自己的學習進度"
  ON learning_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用戶只能更新自己的學習進度"
  ON learning_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用戶只能刪除自己的學習進度"
  ON learning_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- notes 表的 RLS 政策
CREATE POLICY "用戶只能查看自己的筆記"
  ON notes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "用戶只能新增自己的筆記"
  ON notes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用戶只能更新自己的筆記"
  ON notes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用戶只能刪除自己的筆記"
  ON notes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- study_sessions 表的 RLS 政策
CREATE POLICY "用戶只能查看自己的學習記錄"
  ON study_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "用戶只能新增自己的學習記錄"
  ON study_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用戶只能更新自己的學習記錄"
  ON study_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用戶只能刪除自己的學習記錄"
  ON study_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- 自動更新 updated_at 的觸發器
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_progress_updated_at
  BEFORE UPDATE ON learning_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 自動建立學習進度記錄的觸發器
-- ============================================

CREATE OR REPLACE FUNCTION create_learning_progress_on_course_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO learning_progress (course_id, user_id, progress_percentage, status)
  VALUES (NEW.id, NEW.user_id, 0, 'not_started');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_create_learning_progress
  AFTER INSERT ON courses
  FOR EACH ROW
  EXECUTE FUNCTION create_learning_progress_on_course_insert();

-- ============================================
-- 自動更新學習時數的觸發器
-- ============================================

CREATE OR REPLACE FUNCTION update_hours_spent_on_session_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE learning_progress
  SET
    hours_spent = hours_spent + (NEW.duration_minutes::NUMERIC / 60),
    last_studied_at = NEW.created_at,
    status = CASE
      WHEN status = 'not_started' THEN 'in_progress'
      ELSE status
    END
  WHERE course_id = NEW.course_id AND user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_update_hours_spent
  AFTER INSERT ON study_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_hours_spent_on_session_insert();
