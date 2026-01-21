# Perp DEX Dashboard - 市場估值與發幣預期監控

## 🚀 主要功能

- 📊 **實時數據監控**
  - 來源：DefiLlama API (24h 交易量、Open Interest)
  - 更新：每 24 小時自動從 API 獲取最新數據
  - 支持：EdgeX、Backpack、StandX、Variational、Paradex、Extended、Pacifica、GRVT、Reya 等 10+ 項目

- 📈 **Polymarket 市場**
  - FDV 預測機率：滑鼠懸停顯示各項目的不同 FDV 區間的市場機率
  - 熱度排名：按 Polymarket 交易量排名

- 🎨 **健康度分析**
  - Vol/OI 比例：計算並顯示協議健康狀態
  - 顏色編碼：🟢 健康、🟡 正常、🔴 投機



## 🔧 自動化部署設置

GitHub Actions 已配置為每 24 小時：
- 從 DefiLlama 獲取最新數據
- 自動更新 JavaScript 數據和重新部署
- 完整的 CI/CD 流程

## 🎯 技術優勢

- **前端**: React 19 + TypeScript + Vite + Tailwind CSS
- **部署**: GitHub Pages (免費且 HTTPS)
- **數據源**: DefiLlama API (可靠) + Polymarket (預測市場)
- **備份**: Git 版本控制
- **監控**: 構境變據跟蹤 (失敗通知)

## 📱 項址

- **GitHub Repository**: https://github.com/Alvin0617/perpdex-dashboard
- **部署頁面**: https://alvin0617.github.io/perpdex-dashboard

## 🔒 快速開始

```bash
# 克隆倉庫
git clone https://github.com/Alvin0617/perpdex-dashboard.git
cd perpdex-dashboard

# 安裝依賴
pnpm install

# 本地開發
pnpm dev

# 或使用 Cursor 開發
code .
```

## 📊 自動更新
```bash
# 更新 StandX 數據 (範例)
curl -X PATCH "https://api.llama.fi/protocol/edgex" -H "Content-Type: application/json" -d '{"volume_24h": 2000000000, "openInterest": 1200000000}'

# 或使用更新腳本
pnpm dev
```

這樣你就可以：
- ✅ **本開發**：用 `pnpm dev` 快速測試和調整
- ✅ **實時監控**：網站即時反映最新市場狀態
- ✅ **AI 驟助開發**：用 Cursor 來智能分析數據和代碼優化
- ✅ **版本控制**：Git 自動管理所有變更

---

👋 開始使用這個強大的工具來監控你的加密資產組合！🚀