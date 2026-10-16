// Canon text styles: role-based (Display / Heading / Body / Label / Caption).
// Font: Pretendard Variable. Size, line-height, weight are bound to primitive variables.
const FAMILY = 'Pretendard Variable';
const WEIGHT_VAR = { Regular: 'font/weight/regular', Medium: 'font/weight/medium', SemiBold: 'font/weight/semibold', Bold: 'font/weight/bold' };

// name, size, line-height (px), weight, letter-spacing (%)
const SPEC = [
  ['Display/60', 60, 72, 'Bold', -2],
  ['Display/48', 48, 60, 'Bold', -2],
  ['Heading/36', 36, 48, 'SemiBold', -1],
  ['Heading/30', 30, 40, 'SemiBold', -1],
  ['Heading/24', 24, 32, 'SemiBold', 0],
  ['Heading/20', 20, 28, 'SemiBold', 0],
  ['Body/18', 18, 28, 'Regular', 0],
  ['Body/18 Strong', 18, 28, 'SemiBold', 0],
  ['Body/16', 16, 26, 'Regular', 0],
  ['Body/16 Strong', 16, 26, 'SemiBold', 0],
  ['Body/14', 14, 22, 'Regular', 0],
  ['Body/14 Strong', 14, 22, 'SemiBold', 0],
  ['Body/13', 13, 20, 'Regular', 0],
  ['Body/13 Strong', 13, 20, 'SemiBold', 0],
  ['Label/18', 18, 28, 'Medium', 0],
  ['Label/18 Strong', 18, 28, 'SemiBold', 0],
  ['Label/16', 16, 24, 'Medium', 0],
  ['Label/16 Strong', 16, 24, 'SemiBold', 0],
  ['Label/14', 14, 20, 'Medium', 0],
  ['Label/14 Strong', 14, 20, 'SemiBold', 0],
  ['Label/13', 13, 18, 'Medium', 0],
  ['Label/13 Strong', 13, 18, 'SemiBold', 0],
  ['Label/12', 12, 16, 'Medium', 0],
  ['Label/12 Strong', 12, 16, 'SemiBold', 0],
  ['Label/11', 11, 16, 'Medium', 0],
  ['Label/10', 10, 16, 'Medium', 0],
  ['Caption/12', 12, 20, 'Regular', 0],
  ['Caption/11', 11, 18, 'Regular', 0],
  ['Caption/10', 10, 16, 'Regular', 0],
];

// primitives to add when missing (existing line-height naming = px / 4)
const NEED_SIZE = [13, 30, 36];
const NEED_LH = [18, 22, 26, 72];
// variable names cannot contain "." so 4.5 becomes 4_5
const lhName = px => 'line-height/' + String(px / 4).replace('.', '_');

async function main() {
  const report = { created: [], updated: [], failed: [], addedVars: [], unbound: [] };
  const cols = await figma.variables.getLocalVariableCollectionsAsync();
  const prim = cols.find(c => c.name === 'primitive');
  if (!prim) { figma.closePlugin('primitive 컬렉션을 찾지 못했습니다. Canon 파일에서 실행하세요.'); return; }
  const modeId = prim.modes[0].modeId;
  const byName = {};
  for (const id of prim.variableIds) { const v = await figma.variables.getVariableByIdAsync(id); byName[v.name] = v; }

  const ensure = (name, value, scopes) => {
    if (byName[name]) return byName[name];
    const v = figma.variables.createVariable(name, prim, 'FLOAT');
    v.setValueForMode(modeId, value);
    v.scopes = scopes;
    byName[name] = v; report.addedVars.push(name);
    return v;
  };
  for (const s of NEED_SIZE) ensure('font/size/' + s, s, ['FONT_SIZE']);
  for (const l of NEED_LH) ensure(lhName(l), l, ['LINE_HEIGHT']);

  // load fonts first; abort early with a clear message if Pretendard Variable is missing
  const weights = [...new Set(SPEC.map(s => s[3]))];
  for (const w of weights) {
    try { await figma.loadFontAsync({ family: FAMILY, style: w }); }
    catch (e) { figma.closePlugin('폰트 로드 실패: ' + FAMILY + ' ' + w + '. 폰트 설치 후 Figma를 재시작하세요.'); return; }
  }

  const existing = await figma.getLocalTextStylesAsync();
  const styleByName = {}; for (const s of existing) styleByName[s.name] = s;

  for (const [name, size, lh, weight, ls] of SPEC) {
    try {
      let style = styleByName[name]; const isNew = !style;
      if (isNew) { style = figma.createTextStyle(); style.name = name; }
      style.fontName = { family: FAMILY, style: weight };
      style.fontSize = size;
      style.lineHeight = { unit: 'PIXELS', value: lh };
      style.letterSpacing = { unit: 'PERCENT', value: ls };
      const bind = (field, varName) => {
        const v = byName[varName];
        if (!v) { report.unbound.push(name + ':' + field); return; }
        try { style.setBoundVariable(field, v); } catch (e) { report.unbound.push(name + ':' + field); }
      };
      bind('fontSize', 'font/size/' + size);
      bind('lineHeight', lhName(lh));
      bind('fontWeight', WEIGHT_VAR[weight]);
      (isNew ? report.created : report.updated).push(name);
    } catch (e) { report.failed.push(name + ' (' + String(e.message || e).slice(0, 80) + ')'); }
  }

  const msg = '생성 ' + report.created.length + ' / 업데이트 ' + report.updated.length + ' / 실패 ' + report.failed.length +
    ' / 변수 추가 ' + report.addedVars.length + ' / 미바인딩 ' + report.unbound.length;
  console.log(JSON.stringify(report, null, 2));
  figma.closePlugin(msg);
}
main();
