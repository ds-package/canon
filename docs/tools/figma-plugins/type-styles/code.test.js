const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');

const source = readFileSync(`${__dirname}/code.js`, 'utf8');

function mockFigma({ failFont } = {}) {
  const variables = ['regular', 'medium', 'semibold', 'bold'].map((weight, index) => ({
    id: `weight-${weight}`, name: `font/weight/${weight}`, valuesByMode: { light: 400 + index * 100 },
  }));
  const collection = { name: 'primitive', modes: [{ modeId: 'light' }], variableIds: variables.map((v) => v.id) };
  const styles = [];
  const messages = [];
  return {
    variables, styles, messages,
    api: {
      variables: {
        getLocalVariableCollectionsAsync: async () => [collection],
        getVariableByIdAsync: async (id) => variables.find((variable) => variable.id === id),
        createVariable(name) {
          const variable = {
            id: `variable-${variables.length}`, name, valuesByMode: {},
            setValueForMode(mode, value) { this.valuesByMode[mode] = value; },
          };
          variables.push(variable);
          return variable;
        },
      },
      async loadFontAsync(font) { if (font.style === failFont) throw new Error('missing font'); },
      getLocalTextStylesAsync: async () => styles,
      createTextStyle() {
        const style = { bindings: {}, setBoundVariable(field, variable) { this.bindings[field] = variable; } };
        styles.push(style);
        return style;
      },
      closePlugin: (message) => messages.push(message),
    },
  };
}

async function runPlugin(code, figma) {
  await vm.runInNewContext(code, { figma: figma.api, console: { log() {} } });
}

test('adding a style to SPEC creates and binds its missing size and line-height variables', async () => {
  const code = source.replace("['Body/18',", "['Body/15', 15, 23, 'Regular', 0],\n  ['Body/18',");
  assert.notEqual(code, source, 'fixture must add a new entry to the actual SPEC');
  const figma = mockFigma();
  await runPlugin(code, figma);
  const style = figma.styles.find((item) => item.name === 'Body/15');
  assert.equal(style.fontSize, 15);
  assert.equal(style.bindings.fontSize?.name, 'font/size/15');
  assert.equal(style.bindings.fontSize?.valuesByMode.light, 15);
  assert.equal(style.bindings.lineHeight?.name, 'line-height/5_75');
  assert.equal(style.bindings.lineHeight?.valuesByMode.light, 23);
  assert.equal(style.bindings.fontWeight?.name, 'font/weight/regular');
});

test('a missing font aborts without adding variables or writing text styles', async () => {
  const figma = mockFigma({ failFont: 'Regular' });
  const originalVariables = JSON.stringify(figma.variables);
  await runPlugin(source, figma);
  assert.equal(JSON.stringify(figma.variables), originalVariables);
  assert.equal(figma.styles.length, 0);
  assert.match(figma.messages[0], /폰트 로드 실패: Pretendard Variable Regular/);
});
