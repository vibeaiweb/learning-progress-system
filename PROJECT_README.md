# 學習進度管理系統

一個功能完整的學習進度追蹤系統，使用 React + Vite + InsForge 建立。

## ✨ 功能特色

### 🔐 用戶認證
- ✅ Email/密碼註冊登入
- ✅ Gmail OAuth 登入
- ✅ 由 InsForge 提供的安全認證系統

### 📚 課程管理
- ✅ 建立、編輯、刪除課程
- ✅ 設定課程類別和目標學習時數
- ✅ 課程描述和詳細資訊

### 📊 進度追蹤
- ✅ 進度百分比追蹤（0-100%）
- ✅ 學習狀態管理（未開始、進行中、已完成）
- ✅ 已學習時數統計
- ✅ 最後學習時間記錄

### 📝 學習筆記
- ✅ 為每門課程建立多筆筆記
- ✅ 筆記標題和內容
- ✅ 筆記建立時間記錄

### ⏱️ 學習記錄
- ✅ 記錄每次學習時間（分鐘）
- ✅ 學習日期追蹤
- ✅ 學習備註
- ✅ 自動累積學習時數到進度表

### 📈 統計儀表板
- ✅ 總課程數統計
- ✅ 進行中/已完成課程數量
- ✅ 總學習時數統計
- ✅ 平均學習進度顯示
- ✅ 視覺化圖表和進度條

## 🗄️ 資料庫結構

### 表格

#### 1. `courses` - 課程表
```sql
- id: UUID (主鍵)
- user_id: UUID (外鍵 → auth.users)
- title: TEXT (課程名稱)
- description: TEXT (課程描述)
- target_hours: INTEGER (目標時數)
- category: TEXT (課程類別)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

#### 2. `learning_progress` - 學習進度表
```sql
- id: UUID (主鍵)
- course_id: UUID (外鍵 → courses)
- user_id: UUID (外鍵 → auth.users)
- progress_percentage: INTEGER (0-100)
- hours_spent: NUMERIC (已學習時數)
- status: TEXT (狀態)
- last_studied_at: TIMESTAMPTZ
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

#### 3. `notes` - 學習筆記表
```sql
- id: UUID (主鍵)
- course_id: UUID (外鍵 → courses)
- user_id: UUID (外鍵 → auth.users)
- title: TEXT (筆記標題)
- content: TEXT (筆記內容)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

#### 4. `study_sessions` - 學習記錄表
```sql
- id: UUID (主鍵)
- course_id: UUID (外鍵 → courses)
- user_id: UUID (外鍵 → auth.users)
- duration_minutes: INTEGER (學習時長)
- session_date: DATE (學習日期)
- notes: TEXT (備註)
- created_at: TIMESTAMPTZ
```

### 🔒 安全特性

#### Row Level Security (RLS)
所有表格都啟用了 RLS，確保：
- ✅ 用戶只能查看、新增、更新、刪除自己的資料
- ✅ 使用 `auth.uid()` 進行用戶驗證
- ✅ 防止資料洩漏和未授權存取

#### 自動觸發器
1. **自動更新 updated_at**：資料更新時自動更新時間戳記
2. **自動建立進度記錄**：新增課程時自動建立進度記錄
3. **自動累積學習時數**：新增學習記錄時自動更新總時數

## 🚀 快速開始

### 1. 環境需求
- Node.js 18+
- npm 或 yarn

### 2. 安裝相依套件
```bash
npm install
```

### 3. 環境變數設定
`.env` 檔案已經預先設定好：
```env
VITE_INSFORGE_BASE_URL=https://h6t83jpp.us-east.insforge.app
VITE_INSFORGE_ANON_KEY=你的-anon-key
```

### 4. 資料庫初始化
資料庫結構已經建立完成，包含：
- ✅ 4 個資料表
- ✅ RLS 安全政策
- ✅ 自動觸發器
- ✅ 索引優化

### 5. 啟動開發伺服器
```bash
npm run dev
```
應用程式將在 http://localhost:5173 啟動

### 6. 建置生產版本
```bash
npm run build
```

## 📱 使用方式

### 註冊/登入
1. 開啟應用程式
2. 點擊「註冊新帳號」或「登入帳號」
3. 選擇 Email 或 Gmail 登入方式
4. 完成認證流程

### 管理課程
1. 登入後點擊「新增課程」
2. 填寫課程資訊（名稱、描述、類別、目標時數）
3. 點擊課程卡片查看詳細資訊
4. 在詳細頁面可以：
   - 更新學習進度
   - 新增學習筆記
   - 記錄學習時間
   - 刪除課程

### 查看統計
1. 切換到「學習統計」分頁
2. 查看：
   - 總課程數
   - 進行中/已完成課程數
   - 總學習時數
   - 平均學習進度

## 🛠️ 技術架構

### 前端
- **框架**：React 19 + TypeScript
- **建置工具**：Vite 7 (Rolldown)
- **樣式**：Tailwind CSS 3.4
- **狀態管理**：React Hooks (useState, useEffect)

### 後端 (InsForge BaaS)
- **資料庫**：PostgreSQL
- **API**：PostgREST (自動生成 RESTful API)
- **認證**：InsForge Auth (Email + OAuth)
- **SDK**：@insforge/sdk, @insforge/react

### 安全性
- Row Level Security (RLS)
- 用戶隔離資料
- HTTPS 加密傳輸
- JWT Token 認證

## 📂 專案結構

```
learning-progress-system/
├── src/
│   ├── components/         # React 元件
│   │   ├── AddCourseModal.tsx      # 新增課程對話框
│   │   ├── CourseCard.tsx          # 課程卡片
│   │   ├── CourseDetailModal.tsx   # 課程詳細資訊對話框
│   │   ├── CourseList.tsx          # 課程列表
│   │   └── StatsOverview.tsx       # 統計概覽
│   ├── pages/              # 頁面元件
│   │   └── Dashboard.tsx           # 主儀表板
│   ├── lib/                # 工具函數
│   │   └── insforge.ts             # InsForge SDK 設定
│   ├── App.tsx             # 主應用程式
│   ├── main.tsx            # 應用程式入口
│   └── index.css           # 全域樣式
├── database/
│   └── schema.sql          # 資料庫結構定義
├── .env                    # 環境變數
├── package.json            # 專案設定
└── README.md              # 說明文件
```

## 🎨 功能截圖說明

### 登入頁面
- 簡潔的登入介面
- 支援 Email 和 Gmail 登入
- 響應式設計

### 課程列表
- 卡片式佈局
- 顯示進度條和學習時數
- 狀態標籤（未開始/進行中/已完成）

### 課程詳細資訊
- 分頁式介面（進度/筆記/學習記錄）
- 可更新進度和狀態
- 新增筆記和學習記錄
- 刪除課程功能

### 統計儀表板
- 四大統計指標
- 平均進度視覺化
- 鼓勵訊息

## 🔄 自動化功能

### 1. 自動建立進度記錄
新增課程時，系統會自動建立對應的學習進度記錄，初始值為：
- 進度：0%
- 狀態：未開始
- 學習時數：0

### 2. 自動累積學習時數
新增學習記錄時，系統會自動：
- 將學習時間累加到總時數
- 更新最後學習時間
- 如果狀態為「未開始」，自動改為「進行中」

### 3. 自動更新時間戳記
更新課程、進度、筆記時，自動更新 `updated_at` 欄位

## 📊 資料查詢範例

### 查詢用戶的所有課程和進度
```javascript
const { data } = await insforge.database
  .from('courses')
  .select('*, learning_progress(*)')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });
```

### 新增學習記錄
```javascript
const { data } = await insforge.database
  .from('study_sessions')
  .insert([{
    course_id: courseId,
    user_id: userId,
    duration_minutes: 60,
    session_date: '2025-12-28',
    notes: '學習了 React Hooks'
  }]);
```

### 更新進度
```javascript
const { data } = await insforge.database
  .from('learning_progress')
  .update({
    progress_percentage: 75,
    status: 'in_progress'
  })
  .eq('course_id', courseId)
  .eq('user_id', userId);
```

## 🐛 已知問題和限制

1. **刪除課程後需要重新整理頁面**：目前使用 `window.location.reload()`，未來可改用狀態管理
2. **沒有課程編輯功能**：目前只能刪除重建，未來可新增編輯功能
3. **統計圖表較簡單**：未來可整合圖表庫（如 Chart.js）提供更豐富的視覺化

## 🚀 未來改進方向

- [ ] 新增課程編輯功能
- [ ] 優化狀態管理（使用 React Context 或 Zustand）
- [ ] 整合圖表庫顯示學習趨勢
- [ ] 新增學習提醒功能
- [ ] 支援檔案上傳（筆記附件）
- [ ] 匯出學習報告（PDF/CSV）
- [ ] 多語言支援
- [ ] 深色模式

## 📝 授權
MIT License

## 🙋 支援
如有問題，請參考 [InsForge 文件](https://docs.insforge.dev)
