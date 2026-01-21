# 快速部署指南

## 🎯 當前狀況
- ✅ 本地開發服務器運行正常
- ✅ 生產版本已構建完成  
- ✅ 外部網絡可訪問: http://192.168.68.53:3000/

## 🔗 分享給朋友的方法

### 1. **立即可用 (同網絡)**
- 訪問: http://192.168.68.53:3000/
- 適合: 同一 WiFi 網絡下的設備

### 2. **全球分享 (推薦)**

#### 步驟 A: 配置 Git
```bash
cd /Users/alvin0617/projects/perpdex-dashboard/perpdex-dashboard
git config --global user.name "Alvin0617"
git config --global user.email "your.email@example.com"
```

#### 步驟 B: 推送到 GitHub
```bash
git push --set-upstream origin main
```

#### 步驟 C: 啟用 GitHub Pages
1. 前往: https://github.com/Alvin0617/perpdex-dashboard/settings/pages
2. Source 選擇: "GitHub Actions" 
3. 保存設置

### 3. **最終分享連結**
等待幾分鐘後，Dashboard 將在以下地址可訪問：
https://alvin0617.github.io/perpdex-dashboard

## 🛠 問題解決

### 本地網絡無法訪問?
```bash
# 檢查防火牆設置，確保端口 3000 開放
# 或嘗試不同端口
pnpm preview --host --port 8080
```

### GitHub Pages 部署失敗?
```bash
# 檢查 GitHub Actions 日誌
# 確保 deploy.yml 語法正確
```

## 📊 Dashboard 功能
- 🔄 實時數據更新 (Refresh 按鈕)
- 📈 10+ Perp DEX 市場監控  
- 🎯 Polymarket FDV 預測
- 📊 Vol/OI 健康度分析
- 🔍 搜尋和排序功能

現在可以安全地分享給朋友了！🎉