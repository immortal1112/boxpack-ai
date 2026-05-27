// ============================================================
// 装箱算法引擎 — First Fit Decreasing + 6方向旋转
// 维护说明: 此文件处理核心算法，一般不需要修改
// ============================================================

function getRotations(l, w, h) {
  return [[l,w,h],[l,h,w],[w,l,h],[w,h,l],[h,l,w],[h,w,l]];
}

function bestRotation(l, w, h, box) {
  for (const [a,b,c] of getRotations(l,w,h)) {
    if (a <= box.l && b <= box.w && c <= box.h) return [a,b,c];
  }
  return null;
}

function hasOverlap(placed, x, y, z, l, w, h) {
  for (const p of placed) {
    if (x < p.x+p.l && x+l > p.x &&
        y < p.y+p.w && y+w > p.y &&
        z < p.z+p.h && z+h > p.z) return true;
  }
  return false;
}

function findPosition(boxState, il, iw, ih, box) {
  const candidates = [{x:0, y:0, z:0}];
  for (const p of boxState.placed) {
    candidates.push({x:p.x+p.l, y:p.y,   z:p.z});
    candidates.push({x:p.x,     y:p.y+p.w,z:p.z});
    candidates.push({x:p.x,     y:p.y,   z:p.z+p.h});
  }
  // sort: prefer low z first (bottom-up packing)
  candidates.sort((a,b) => a.z - b.z || a.x - b.x);
  for (const c of candidates) {
    if (c.x+il > box.l || c.y+iw > box.w || c.z+ih > box.h) continue;
    if (!hasOverlap(boxState.placed, c.x, c.y, c.z, il, iw, ih)) return c;
  }
  return null;
}

function runPacking(orderItems, box) {
  // Expand quantities, sort by volume desc (FFD)
  const allItems = [];
  for (const it of orderItems) {
    for (let q = 0; q < it.qty; q++) allItems.push({...it, qty:1});
  }
  allItems.sort((a,b) => (b.l*b.w*b.h) - (a.l*a.w*a.h));

  const boxes = [];

  for (const item of allItems) {
    const rot = bestRotation(item.l, item.w, item.h, box);
    if (!rot) continue;
    const [il, iw, ih] = rot;
    let placed = false;

    for (const bx of boxes) {
      if (bx.totalWt + item.wt > box.maxWt) continue;
      const pos = findPosition(bx, il, iw, ih, box);
      if (pos) {
        bx.placed.push({
          sku: item.sku, name: item.name,
          x: pos.x, y: pos.y, z: pos.z,
          l: il, w: iw, h: ih, wt: item.wt
        });
        bx.totalWt += item.wt;
        bx.usedVol += il * iw * ih;
        placed = true;
        break;
      }
    }

    if (!placed) {
      const nb = { placed:[], totalWt:0, usedVol:0 };
      nb.placed.push({
        sku: item.sku, name: item.name,
        x:0, y:0, z:0, l:il, w:iw, h:ih, wt:item.wt
      });
      nb.totalWt += item.wt;
      nb.usedVol += il * iw * ih;
      boxes.push(nb);
    }
  }

  return boxes;
}
