// ============================================================
// 历史记录模块 — 使用 localStorage 本地存储
// ============================================================

const HISTORY_KEY = 'boxpack_history';
const MAX_RECORDS = 100;

function saveHistory(orderText, result, boxName) {
  const records = getHistory();
  records.unshift({
    id: Date.now(),
    date: new Date().toLocaleString('zh-SG'),
    orderText,
    boxName,
    boxCount: result.boxes.length,
    totalItems: result.boxes.reduce((s,b) => s + b.placed.length, 0),
    totalWt: result.boxes.reduce((s,b) => s + b.totalWt, 0).toFixed(2),
    avgUtil: result.avgUtil,
    flaggedSkus: result.flagged.map(f => f.sku + '×' + f.qty).join(', ') || '无',
  });
  if (records.length > MAX_RECORDS) records.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(records));
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch(e) { return []; }
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

function renderHistoryTable() {
  const records = getHistory();
  if (!records.length) return '<p style="color:var(--muted);font-size:13px">暂无历史记录</p>';
  return `<table class="hist-table">
    <thead><tr>
      <th>时间</th><th>箱型</th><th>箱数</th><th>件数</th><th>总重</th><th>利用率</th><th>超长标记</th>
    </tr></thead>
    <tbody>
      ${records.map(r => `<tr>
        <td>${r.date}</td>
        <td>${r.boxName}</td>
        <td><b>${r.boxCount}</b></td>
        <td>${r.totalItems}</td>
        <td>${r.totalWt}kg</td>
        <td>${r.avgUtil}%</td>
        <td style="color:${r.flaggedSkus==='无'?'var(--acc)':'var(--warn)'}">${r.flaggedSkus}</td>
      </tr>`).join('')}
    </tbody>
  </table>`;
}
