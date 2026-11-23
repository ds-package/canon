const INSET = 200;

function alignComponentSet(set) {
  const variants = set.children;
  if (!variants.length) return false;
  if (set.locked || variants.some((node) => node.locked)) {
    throw new Error('locked');
  }

  const minX = Math.min(...variants.map((node) => node.x));
  const minY = Math.min(...variants.map((node) => node.y));
  const offsetX = INSET - minX;
  const offsetY = INSET - minY;
  const targets = variants.map((node) => ({
    node,
    x: node.x + offsetX,
    y: node.y + offsetY,
  }));
  const right = Math.max(...targets.map(({ node, x }) => x + node.width));
  const bottom = Math.max(...targets.map(({ node, y }) => y + node.height));

  set.resize(right + INSET, bottom + INSET);

  for (const target of targets) {
    target.node.x = target.x;
    target.node.y = target.y;
  }
  return true;
}

const sets = figma.currentPage.selection.filter((node) => node.type === 'COMPONENT_SET');
let aligned = 0;
let skipped = 0;
let failed = 0;

for (const set of sets) {
  try {
    if (alignComponentSet(set)) aligned += 1;
    else skipped += 1;
  } catch {
    failed += 1;
  }
}

figma.closePlugin(
  sets.length
    ? `정리 ${aligned}개 / 빈 세트 ${skipped}개 / 실패 ${failed}개`
    : '정리할 컴포넌트 세트를 선택하세요.',
);
