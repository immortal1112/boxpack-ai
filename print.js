// ============================================================
// 打印箱唛模块
// ============================================================

function printBoxLabel(boxIndex, boxData, selectedBox, totalBoxes) {
  const date = new Date().toLocaleDateString('zh-SG');
  const util = Math.round(boxData.usedVol / (selectedBox.l * selectedBox.w * selectedBox.h) * 100);

  // Group SKUs
  const grouped = {};
  for (const p of boxData.placed) {
    if (!grouped[p.sku]) grouped[p.sku] = { name: p.name, count: 0 };
    grouped[p.sku].count++;
  }

  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>箱唛 - 箱${boxIndex+1}</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family: 'Microsoft YaHei', Arial, sans-serif; padding:20px; }
  .label {
    width: 148mm; min-height: 105mm;
    border: 2px solid #000; padding: 12px;
    page-break-after: always;
  }
  .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; border-bottom:1px solid #000; padding-bottom:8px; }
  .company { font-size:11px; color:#666; }
  .box-num { font-size:32px; font-weight:700; color:#000; }
  .box-total { font-size:12px; color:#666; }
  .info-row { display:flex; gap:16px; margin-bottom:8px; font-size:11px; }
  .info-item label { color:#666; }
  .info-item span { font-weight:600; }
  .sku-list { border:1px solid #ddd; border-radius:4px; overflow:hidden; margin-bottom:8px; }
  .sku-list table { width:100%; border-collapse:collapse; font-size:11px; }
  .sku-list th { background:#f5f5f5; padding:4px 8px; text-align:left; border-bottom:1px solid #ddd; }
  .sku-list td { padding:4px 8px; border-bottom:1px solid #eee; }
  .sku-list tr:last-child td { border:none; }
  .footer { font-size:10px; color:#999; text-align:center; margin-top:6px; }
  .oversized-note { background:#fff3cd; border:1px solid #ffc107; border-radius:4px; padding:6px 10px; font-size:11px; color:#856404; margin-bottom:8px; }
  @media print { body { padding:0; } }
</style>
</head>
<body>
<div class="label">
  <div class="header">
    <div class="company">
      <div style="font-size:13px;font-weight:600">📦 BoxPack 装箱系统</div>
      <div>${date}</div>
    </div>
    <div style="text-align:right">
      <div class="box-num">箱 ${boxIndex+1}</div>
      <div class="box-total">共 ${totalBoxes} 箱</div>
    </div>
  </div>

  <div class="info-row">
    <div class="info-item"><label>箱型 </label><span>${selectedBox.name}</span></div>
    <div class="info-item"><label>尺寸 </label><span>${selectedBox.l}×${selectedBox.w}×${selectedBox.h}cm</span></div>
    <div class="info-item"><label>总重 </label><span>${boxData.totalWt.toFixed(2)}kg</span></div>
    <div class="info-item"><label>利用率 </label><span>${util}%</span></div>
  </div>

  <div class="sku-list">
    <table>
      <thead><tr><th>SKU</th><th>品名</th><th>件数</th></tr></thead>
      <tbody>
        ${Object.entries(grouped).map(([sku,g]) =>
          `<tr><td>${sku}</td><td>${g.name}</td><td><b>${g.count}</b></td></tr>`
        ).join('')}
      </tbody>
    </table>
  </div>

  <div class="footer">由 BoxPack AI 智能装箱系统生成 · ${new Date().toLocaleString('zh-SG')}</div>
</div>
<script>window.onload=()=>{window.print();}<\/script>
</body></html>`);
  win.document.close();
}

function printAllLabels(boxes, selectedBox) {
  boxes.forEach((box, i) => printBoxLabel(i, box, selectedBox, boxes.length));
}
