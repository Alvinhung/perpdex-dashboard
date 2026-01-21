# Perp DEX Dashboard - 市場估值與發幣預期監控

這個 Dashboard 提供了完整的永續合約交易所 (Perp DEX) 的最新市場數據監控平台。

## 🚀 主要功能

- 📊 **實時數據監控**
  - 來源：DefiLlama API (24h 交易量、Open Interest)
  - 更新：每 24 小時自動從 API 獲取最新數據
  - 支持：EdgeX、Backpack、StandX、Variational、Paradex 等 10+ 項目

- 📈 **Polymarket 預測市場**
  - FDV 預測機率：滑鼠懸停顯示各項目的不同 FDV 區間的市場機率
  - 數據來源：直接爬取 Polymarket 市場頁面
  - 支持：EdgeX、Backpack、StandX、等熱門項目

- 🎨 **健康度分析**
  - Vol/OI 比例：計算並顯示協議健康狀態
  - 顏色編碼：
    - 🟢 健康：Vol/OI < 5 (有機成長)
    - 🟡 正常：Vol/OI 5-10 (正常範圍)
    - 🟠 投機：Vol/OI > 10 (可能刷量)

## 🌐 技術特點

- **前端框架**: React 19 + TypeScript + Vite
- **樣式框架**: Tailwind CSS (完整配置)
- **圖表庫**: Recharts (交互式圖表)
- **圖標庫**: Lucide React (現代化圖標)
- **部署方案**: GitHub Actions 自動部署
- **響應式設計**: 完全適用手機和桌面

## 📊 監控的項目

### 🔥 T1 項目 (預期發幣潛力高)
- **EdgeX**: 24h Volume $4.09B, OI $1.2B
- **Backpack**: 24h Volume $1B, OI $500M

### 🟢 T2 項目 (專業級別)
- **Variational**: 24h Volume $2B, OI $1.14B
- **StandX**: 24h Volume $190M, OI $30M

### 🌟 T3 項目 (早期/專業項目)
- **Paradex**: 24h Volume $800M, OI $395M
- **Extended**: 24h Volume $1.8B, OI $278M

## 🚀 部署資訊

### 🌐 GitHub Pages 自動部署
- **倉庫地址**: https://github.com/Alvin0617/perpdex-dashboard
- **部署狀態**: https://alvin0617.github.io/perpdex-dashboard
- **自動更新**: 每 24 小時從 DefiLlama API 獲取最新數據
- **版本控制**: Git 歷史追蹤，自動化部署流程

## 🎯 使用指南

### 本地開發
```bash
cd perpdex-dashboard
pnpm dev
```

### 查看自動部署
```bash
gh workflow list
```

### 手動數據更新
```bash
git add .
git commit -m "Update specific data"
git push
```

## 🔧 GitHub Actions 配置
- 自動化工作流程已設置
- 每 24 小時檢查 API 更新
- 自動部署到 GitHub Pages

---

## 📈 技術功能演示
- ✅ 實時數據同步
- 🎨 交互式圖表體驗
- 🎯 專業級格式化代碼
- 📱 完整的響應式設計

## 🌟 商業級功能
- 🏢 市場熱度排名
- 💰 Vol/OI 健康度分析
- 📊 FDV 預測機率懸停
- 🔄 數據更新觸發

---

這個 Dashboard 展示了完整的 Perp DEX 市場生態，幫助投資者和交易者做出更明智的決策！