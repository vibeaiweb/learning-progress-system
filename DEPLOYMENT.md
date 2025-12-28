# 部署到 Zeabur 指南

## 📋 部署前準備

### 1. 確認環境變數
你的 `.env` 檔案包含：
```env
VITE_INSFORGE_BASE_URL=https://h6t83jpp.us-east.insforge.app
VITE_INSFORGE_ANON_KEY=你的-anon-key
```

**重要**：這些變數需要在 Zeabur 上重新設定，因為 `.env` 不會被推送到 Git。

---

## 🚀 部署步驟

### 步驟 1：建立 Git 倉庫（如果還沒有）

在專案目錄下執行：

```bash
# 初始化 Git 倉庫
git init

# 新增所有檔案
git add .

# 建立第一個 commit
git commit -m "Initial commit: Learning Progress Management System"
```

---

### 步驟 2：推送到 GitHub

#### 2.1 在 GitHub 上建立新倉庫
1. 前往 https://github.com/new
2. 倉庫名稱：`learning-progress-system`（或任何你喜歡的名稱）
3. 選擇 **Public** 或 **Private**
4. **不要**勾選「Initialize this repository with a README」
5. 點擊「Create repository」

#### 2.2 推送程式碼到 GitHub
複製 GitHub 給你的指令，應該類似：

```bash
# 設定遠端倉庫
git remote add origin https://github.com/你的用戶名/learning-progress-system.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

---

### 步驟 3：在 Zeabur 上部署

#### 3.1 登入 Zeabur
1. 前往 https://zeabur.com
2. 使用 GitHub 帳號登入

#### 3.2 建立新專案
1. 點擊「Create Project」或「新增專案」
2. 輸入專案名稱：`learning-progress-system`
3. 選擇區域（建議：Hong Kong 或 Tokyo，速度較快）

#### 3.3 部署服務
1. 在專案頁面，點擊「Add Service」或「新增服務」
2. 選擇「Git」
3. 選擇你的 GitHub 倉庫：`learning-progress-system`
4. Zeabur 會自動偵測這是一個 Vite 專案

#### 3.4 設定環境變數
1. 在服務頁面，點擊「Variables」或「環境變數」分頁
2. 新增以下環境變數：

| 變數名稱 | 變數值 |
|---------|--------|
| `VITE_INSFORGE_BASE_URL` | `https://h6t83jpp.us-east.insforge.app` |
| `VITE_INSFORGE_ANON_KEY` | `你的-anon-key（從 .env 複製）` |

**取得 ANON_KEY 的方法：**
```bash
# 在本地執行，查看 .env 檔案
cat .env
```

#### 3.5 設定網域（選用）
1. 在服務頁面，點擊「Domain」或「網域」分頁
2. Zeabur 會自動提供一個 `.zeabur.app` 子網域
3. 或者綁定你自己的網域

#### 3.6 部署
1. 環境變數設定完成後，點擊「Deploy」或「部署」
2. 等待建置完成（約 2-3 分鐘）
3. 建置成功後，點擊網域連結即可訪問

---

## ✅ 部署檢查清單

- [ ] Git 倉庫已初始化
- [ ] 程式碼已推送到 GitHub
- [ ] Zeabur 專案已建立
- [ ] 服務已連接到 GitHub 倉庫
- [ ] 環境變數已設定（`VITE_INSFORGE_BASE_URL` 和 `VITE_INSFORGE_ANON_KEY`）
- [ ] 部署成功，網站可訪問
- [ ] 可以正常註冊/登入
- [ ] 可以新增課程和記錄進度

---

## 🔄 更新部署

當你修改程式碼後，只需要：

```bash
# 提交變更
git add .
git commit -m "描述你的變更"

# 推送到 GitHub
git push
```

Zeabur 會自動偵測到變更並重新部署。

---

## 🐛 常見問題

### 1. 部署後出現白畫面
**原因**：環境變數未正確設定

**解決方法**：
1. 檢查 Zeabur 的環境變數設定
2. 確認變數名稱完全正確（區分大小寫）
3. 確認變數值正確（特別是 ANON_KEY）
4. 重新部署

### 2. 登入後出現錯誤
**原因**：InsForge 的重定向 URL 未設定

**解決方法**：
1. 前往 InsForge Dashboard
2. 在 Authentication 設定中新增你的 Zeabur 網域到允許的重定向 URL
3. 例如：`https://your-app.zeabur.app`

### 3. 資料庫連線錯誤
**原因**：BASE_URL 或 ANON_KEY 錯誤

**解決方法**：
1. 確認環境變數值正確
2. 測試 InsForge API 是否正常運作

### 4. 建置失敗
**原因**：套件安裝或建置錯誤

**解決方法**：
1. 檢查 Zeabur 的建置日誌
2. 確認 `package.json` 中的相依套件版本正確
3. 本地執行 `npm run build` 確認可以成功建置

---

## 📊 效能優化建議

### 1. 啟用 Zeabur CDN
在 Zeabur 服務設定中啟用 CDN，加速靜態資源載入。

### 2. 設定快取
Zeabur 會自動設定合理的快取策略。

### 3. 壓縮資源
Vite 建置時已自動啟用程式碼壓縮和分割。

---

## 🔐 安全性提醒

1. **永遠不要**將 `.env` 推送到 Git
2. **定期更新** InsForge ANON_KEY
3. **使用 HTTPS** 訪問你的應用（Zeabur 自動提供）
4. **備份資料庫**結構檔案（`database/schema.sql`）

---

## 💰 成本估算

Zeabur 提供免費方案：
- ✅ 免費額度：每月 $5 USD 額度
- ✅ 自動休眠：閒置 15 分鐘後自動休眠
- ✅ 適合個人專案和測試

如果需要更高效能：
- **Developer Plan**：$5/月，移除休眠限制
- **Team Plan**：$10/月起，支援團隊協作

---

## 📱 部署後測試

部署成功後，請測試以下功能：

1. **認證功能**
   - [ ] Email 註冊
   - [ ] Email 登入
   - [ ] Gmail OAuth 登入
   - [ ] 登出

2. **課程管理**
   - [ ] 新增課程
   - [ ] 查看課程列表
   - [ ] 點擊課程查看詳情
   - [ ] 刪除課程

3. **進度追蹤**
   - [ ] 更新進度百分比
   - [ ] 更改課程狀態
   - [ ] 查看進度條更新

4. **筆記功能**
   - [ ] 新增筆記
   - [ ] 查看筆記列表

5. **學習記錄**
   - [ ] 記錄學習時間
   - [ ] 查看學習記錄
   - [ ] 確認時數自動累積

6. **統計儀表板**
   - [ ] 查看總課程數
   - [ ] 查看總學習時數
   - [ ] 查看平均進度

---

## 🎉 部署完成！

恭喜！你的學習進度管理系統現在已經在 Zeabur 上運行了。

你可以：
- 📱 從任何裝置訪問你的應用
- 🔗 分享連結給其他人使用
- 📊 追蹤你的學習進度
- 📝 隨時隨地記錄學習筆記

有任何問題，請參考：
- Zeabur 文件：https://zeabur.com/docs
- InsForge 文件：https://docs.insforge.dev
