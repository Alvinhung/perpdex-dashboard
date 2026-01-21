import { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Coins, 
  BarChart3, 
  RefreshCcw, 
  Info,
  Search,
  AlertCircle,
  Scale
} from 'lucide-react';
import { 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  ComposedChart
} from 'recharts';

/**
 * 顏色配置
 */
const COLORS = {
  primary: '#2D5975',
  secondary: '#708238',
  accent: '#C3B091',
  background: '#F5F2EB',
  cardBg: '#D9C8B4',
  text: '#1A2E3B',
  white: '#FFFFFF',
  warning: '#E6A23C',
  danger: '#D9534F',
  footerText: '#7F867B' // 頁尾指定色碼
};

// 類型定義
interface DataItem {
  id: number;
  name: string;
  tier: string;
  chain: string;
  points_program: string;
  volume_24h: number;
  oi: number;
  fdv_low: number;
  fdv_high: number;
  poly_vol: string;
  note: string;
  volOiRatio?: number;
}

// 完整數據列表
const INITIAL_DATA: DataItem[] = [
  { 
    id: 1, 
    name: 'EdgeX', 
    tier: 'T1',
    chain: 'Multi Chain', 
    points_program: 'Active', 
    volume_24h: 3300000000, 
    oi: 820000000, // Ratio: ~4.02
    fdv_low: 1.0, 
    fdv_high: 2.0, 
    poly_vol: '745K',
    note: ''
  },
  { 
    id: 2, 
    name: 'StandX', 
    tier: 'T1',
    chain: 'Multi Chain', 
    points_program: 'Active', 
    volume_24h: 175000000, 
    oi: 20000000, // Ratio: ~8.75 (Medium)
    fdv_low: 0.8, 
    fdv_high: 1.0, 
    poly_vol: '410K',
    note: ''
  },
  { 
    id: 3, 
    name: 'Backpack', 
    tier: 'T1',
    chain: 'N/A', 
    points_program: 'Season 4', 
    volume_24h: 1265201632, 
    oi: 255202649, // Ratio: 19 (High/Speculative)
    fdv_low: 0.7, 
    fdv_high: 1.0, 
    poly_vol: '290K',
    note: ''
  },
  { 
    id: 4, 
    name: 'Ostium', 
    tier: 'T2',
    chain: 'Multi Chain', 
    points_program: 'Season 2', 
    volume_24h: 178955155, 
    oi: 40452297, 
    fdv_low: 0.7, 
    fdv_high: 1.0, 
    poly_vol: '7K',
    note: '應該會加開更低的 FDV'
  },
  { 
    id: 5, 
    name: 'Variational', 
    tier: 'T2',
    chain: 'Arbitrum', 
    points_program: 'Season 1', 
    volume_24h: 812600000, 
    oi: 1550000000, // Ratio: 0.52 (Very Healthy)
    fdv_low: 0.5, 
    fdv_high: 0.8, 
    poly_vol: '15K',
    note: '當前最早期'
  },
  { 
    id: 6, 
    name: 'Paradex', 
    tier: 'T2',
    chain: 'Multi Chain', 
    points_program: 'Live', 
    volume_24h: 1777585011, 
    oi: 781135243, 
    fdv_low: 0.3, 
    fdv_high: 0.5, 
    poly_vol: '6K',
    note: '積分活動尾聲'
  },
  { 
    id: 7, 
    name: 'Extended', 
    tier: 'T3',
    chain: 'Multi Chain', 
    points_program: 'Live', 
    volume_24h: 1395835456, 
    oi: 202123228, 
    fdv_low: 0.3, 
    fdv_high: 0.5, 
    poly_vol: '61K',
    note: ''
  },
  { 
    id: 8, 
    name: 'Pacifica', 
    tier: 'T3',
    chain: 'Solana', 
    points_program: 'Live', 
    volume_24h: 700387954, 
    oi: 78138297, 
    fdv_low: 0.3, 
    fdv_high: 0.5, 
    poly_vol: '7K',
    note: '前 FTX COO 創立'
  },
  { 
    id: 9, 
    name: 'GRVT', // 更新為 GRVT
    tier: 'T2', 
    chain: 'Multi Chain', 
    points_program: 'Live', 
    volume_24h: 1000000000, 
    oi: 370000000, 
    fdv_low: 0.2, 
    fdv_high: 0.3, 
    poly_vol: '46K',
    note: ''
  },
  { 
    id: 10, 
    name: 'Reya', 
    tier: 'T3',
    chain: 'Reya Network', 
    points_program: 'OG', 
    volume_24h: 45000000, 
    oi: 22000000, 
    fdv_low: 0.15, 
    fdv_high: 0.2, 
    poly_vol: '32K',
    note: ''
  }
];

const formatCurrency = (value: number) => {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(2)}B`;
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  return `$${value.toLocaleString()}`;
};

// 計算 Vol/OI 並決定顏色
// 規則：越小越健康 (Healthy)。過高代表刷量或投機 (Speculative)
const getVolOiStatus = (vol: number, oi: number) => {
  if (!oi || oi === 0) return { ratio: 0, color: 'text-gray-400', label: 'N/A' };
  
  const ratio = vol / oi;
  let color = 'text-green-700 bg-green-100';
  let label = 'Healthy';

  if (ratio > 20) {
    color = 'text-red-700 bg-red-100';
    label = 'Overheated';
  } else if (ratio > 10) {
    color = 'text-amber-700 bg-amber-100';
    label = 'Elevated';
  }

  return { ratio: ratio.toFixed(1), color, label };
};

interface CardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: React.ComponentType<any>;
  trend?: number;
}

const Card = ({ title, value, subValue, icon: Icon, trend }: CardProps) => (
  <div className="rounded-xl p-6 shadow-lg border-l-4" style={{ backgroundColor: COLORS.white, borderLeftColor: COLORS.secondary }}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-bold tracking-wider mb-1" style={{ color: COLORS.secondary }}>{title}</p>
        <h3 className="text-2xl font-bold" style={{ color: COLORS.primary }}>{value}</h3>
        {subValue && <p className="text-xs mt-1 opacity-70" style={{ color: COLORS.text }}>{subValue}</p>}
      </div>
      <div className="p-3 rounded-full" style={{ backgroundColor: `${COLORS.accent}30` }}>
        <Icon size={24} style={{ color: COLORS.primary }} />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-sm">
        {trend > 0 ? <TrendingUp size={16} className="text-green-600 mr-1" /> : <TrendingDown size={16} className="text-red-500 mr-1" />}
        <span className={trend > 0 ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
          {Math.abs(trend)}% vs last week
        </span>
      </div>
    )}
  </div>
);

export default function App() {
  const [data, setData] = useState<DataItem[]>(INITIAL_DATA);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'fdv_high', direction: 'desc' });
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [searchTerm, setSearchTerm] = useState('');

  // 模擬數據更新
  const refreshData = () => {
    const newData = data.map(item => ({
      ...item,
      volume_24h: item.volume_24h * (1 + (Math.random() * 0.1 - 0.05)),
      oi: item.oi * (1 + (Math.random() * 0.05 - 0.025)), // OI 波動通常較小
    }));
    setData(newData);
    setLastUpdated(new Date().toLocaleTimeString());
  };

  // 排序邏輯
  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (searchTerm) {
      sortableItems = sortableItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.chain.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 增加 Vol/OI 排序邏輯
    sortableItems = sortableItems.map(item => ({
      ...item,
      volOiRatio: item.oi ? item.volume_24h / item.oi : 0
    }));

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue = (a as any)[sortConfig.key];
        let bValue = (b as any)[sortConfig.key];

        // 特殊處理 Vol/OI 排序
        if (sortConfig.key === 'vol_oi_ratio') {
           aValue = a.volOiRatio;
           bValue = b.volOiRatio;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig, searchTerm]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // 計算總計數據
  const totalVolume = data.reduce((acc, curr) => acc + curr.volume_24h, 0);
  const totalOI = data.reduce((acc, curr) => acc + curr.oi, 0);

  // 表格標頭組件
  interface SortableHeaderProps {
    label: string;
    sortKey: string;
    align?: string;
    tooltip?: boolean;
  }

  const SortableHeader = ({ label, sortKey, align = "left", tooltip = false }: SortableHeaderProps) => (
    <th 
      className={`px-4 py-4 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors hover:bg-opacity-80 whitespace-nowrap`}
      style={{ color: COLORS.white, backgroundColor: COLORS.primary, textAlign: align as any }}
      onClick={() => requestSort(sortKey)}
    >
      <div className={`flex items-center gap-1 ${align === "right" ? "justify-end" : "justify-start"}`}>
        {label}
        {tooltip && <Info size={12} className="opacity-70" />}
        <ArrowUpDown size={14} className="opacity-60" />
      </div>
    </th>
  );

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: COLORS.background, color: COLORS.text }}>
      
      {/* 頂部導航列 */}
      <nav className="shadow-md" style={{ backgroundColor: COLORS.primary }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Activity className="text-white" size={28} />
              <span className="text-white text-xl font-bold tracking-tight">PerpMarket <span style={{ color: COLORS.accent }}>Alpha</span></span>
            </div>
            <div className="flex items-center gap-4 text-sm text-white opacity-90">
              <span className="hidden md:inline">Data Source: Polymarket / DefiLlama</span>
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                Live
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 控制與標題區 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: COLORS.primary }}>市場估值與發幣預期</h1>
            <p className="mt-1" style={{ color: COLORS.secondary }}>Perp DEX 積分、OI 與 Polymarket FDV 預測監控</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-40" size={16} />
              <input 
                type="text" 
                placeholder="Search Protocol..." 
                className="pl-9 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.accent }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={refreshData}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white shadow-sm hover:opacity-90 transition-all active:scale-95"
              style={{ backgroundColor: COLORS.secondary }}
            >
              <RefreshCcw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* 概覽卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card 
            title="TOP FDV PREDICTION" 
            value="EdgeX" 
            subValue="Est. $1B - $2B" 
            icon={TrendingUp}
            trend={5}
          />
          <Card 
            title="TOTAL 24H VOLUME" 
            value={formatCurrency(totalVolume)}
            subValue="Across tracked DEXs" 
            icon={BarChart3}
            trend={12}
          />
          <Card 
            title="TOTAL OPEN INTEREST" 
            value={formatCurrency(totalOI)}
            subValue="Market Depth" 
            icon={Activity}
            trend={8}
          />
          <Card 
            title="TRACKED PROTOCOLS" 
            value={data.length.toString()} 
            subValue="Polymarket Listed" 
            icon={Coins}
            trend={3}
          />
        </div>

        {/* 主要圖表與數據區 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* 左側：Polymarket FDV 預測視覺化 */}
          <div className="lg:col-span-2 rounded-xl shadow-lg p-6 bg-white border-t-4" style={{ borderColor: COLORS.primary }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: COLORS.primary }}>
                <TrendingUp size={20} />
                Polymarket FDV 預測區間 (Billion $)
              </h2>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  layout="vertical"
                  data={sortedData}
                  margin={{ top: 20, right: 30, bottom: 20, left: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e5e5" />
                  <XAxis type="number" unit="B" domain={[0, 'auto']} tick={{fill: COLORS.text}} />
                  <YAxis dataKey="name" type="category" width={100} tick={{fill: COLORS.primary, fontWeight: 600, fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: `1px solid ${COLORS.accent}` }}
                    formatter={(value, name) => [`$${value}B`, name === 'fdv_high' ? 'High Est.' : (name === 'fdv_low' ? 'Low Est.' : name)]}
                  />
                  <Legend />
                  <Bar dataKey="fdv_low" stackId="a" fill="transparent" />
                  <Bar name="FDV Range" dataKey="fdv_high" stackId="a" fill={COLORS.secondary} barSize={24} radius={[0, 4, 4, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 右側：Poly 關注度 (Volume/User) */}
          <div className="rounded-xl shadow-lg p-6 bg-white border-t-4" style={{ borderColor: COLORS.accent }}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: COLORS.primary }}>
              <Coins size={20} />
              Polymarket 熱度 (Vol)
            </h2>
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {data.sort((a,b) => parseFloat(b.poly_vol.replace('K','')) - parseFloat(a.poly_vol.replace('K',''))).map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-gray-400 w-4">#{idx + 1}</span>
                    <div>
                      <p className="font-bold text-sm" style={{ color: COLORS.primary }}>{item.name}</p>
                      <p className="text-xs text-gray-500">FDV High: ${item.fdv_high}B</p>
                    </div>
                  </div>
                  <div className="text-right">
                     <span className="text-sm font-bold block" style={{color: COLORS.secondary}}>{item.poly_vol}</span>
                     <span className="text-xs text-gray-400">Vol/Bets</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 詳細數據表格 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="font-bold text-lg" style={{ color: COLORS.primary }}>詳細市場數據</h2>
            
            {/* 備註圖例 */}
            <div className="flex items-center gap-3 text-xs bg-gray-100 px-3 py-2 rounded-lg">
              <span className="font-bold text-gray-600 flex items-center gap-1">
                <Scale size={12} />
                Vol/OI Ratio:
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div> 健康 (低)
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div> 偏高
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div> 過熱 (高)
              </span>
              <span className="text-gray-400 ml-2 border-l pl-2">數字越小越健康</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <SortableHeader label="Protocol" sortKey="name" tooltip={false} />
                  <SortableHeader label="24h Vol" sortKey="volume_24h" align="right" tooltip={false} />
                  <SortableHeader label="Open Interest" sortKey="oi" align="right" tooltip={false} />
                  <SortableHeader label="Vol / OI Ratio" sortKey="vol_oi_ratio" align="center" tooltip={true} />
                  <SortableHeader label="Poly. Vol" sortKey="poly_vol" align="right" tooltip={false} />
                  <SortableHeader label="FDV High" sortKey="fdv_high" align="right" tooltip={false} />
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: COLORS.primary, color: COLORS.white }}>Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedData.map((row, index) => {
                  const volOiStatus = getVolOiStatus(row.volume_24h, row.oi);
                  
                  return (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-8 rounded-full ${index < 3 ? 'bg-[#708238]' : 'bg-gray-300'}`}></div>
                          <div>
                            <div className="font-bold text-base" style={{ color: COLORS.primary }}>{row.name}</div>
                            <div className="text-xs text-gray-400">{row.chain}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-gray-700 font-medium">
                        {formatCurrency(row.volume_24h)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-gray-600">
                        {formatCurrency(row.oi)}
                      </td>
                      
                      {/* Vol / OI Ratio Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${volOiStatus.color}`}>
                          {volOiStatus.ratio}x
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="font-bold px-2 py-1 bg-gray-100 rounded text-gray-700 text-xs">{row.poly_vol}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                         <span className="font-mono font-bold" style={{ color: COLORS.secondary }}>${row.fdv_high}B</span>
                      </td>
                      <td className="px-6 py-4">
                        {row.note && (
                          <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-100 max-w-[150px] truncate" title={row.note}>
                            <AlertCircle size={12} className="flex-shrink-0" />
                            {row.note}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs text-center text-gray-400">
            Last updated: {lastUpdated} • Vol/OI logic: Lower ratio indicates healthier organic growth vs speculative wash trading.
          </div>
        </div>

      </main>

      {/* Footer Section */}
      <footer className="py-12 flex flex-col items-center justify-center gap-6 text-sm font-medium border-t border-gray-200 mt-8" style={{ color: COLORS.footerText, backgroundColor: '#F5F2EB' }}>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          <a 
            href="https://x.com/Alvin0617" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:opacity-75 transition-opacity flex items-center gap-2"
          >
            made by @alvin0617
          </a>
          <span className="hidden sm:inline opacity-30">|</span>
          <a 
            href="https://t.me/variational_cn" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:opacity-75 transition-opacity flex items-center gap-2"
          >
            Join Variational CW
          </a>
        </div>
        <a 
          href="https://x.com/CryptoWesearch" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:scale-105 transition-transform duration-300"
        >
          <img 
            src="https://pbs.twimg.com/profile_images/1608304695776509954/gaWpTcjW_400x400.jpg" 
            alt="Logo" 
            className="w-16 h-16 rounded-full shadow-md border-2 border-white"
          />
        </a>
      </footer>

    </div>
  );
}