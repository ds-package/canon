const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');

const source = readFileSync(`${__dirname}/code.js`, 'utf8');

function runPlugin(selection) {
  const messages = [];
  vm.runInNewContext(source, {
    figma: {
      currentPage: { selection },
      closePlugin(message) { messages.push(message); },
    },
  });
  return messages;
}

test('moves the variant group to a 200px inset and preserves relative layout', () => {
  const children = [
    { x: 40, y: 30, width: 80, height: 48 },
    { x: 180, y: 110, width: 56, height: 32 },
  ];
  const set = {
    type: 'COMPONENT_SET',
    x: 900,
    y: 700,
    width: 400,
    height: 300,
    children,
    resize(width, height) { this.width = width; this.height = height; },
  };

  runPlugin([set]);

  assert.deepEqual(children, [
    { x: 200, y: 200, width: 80, height: 48 },
    { x: 340, y: 280, width: 56, height: 32 },
  ]);
  assert.equal(set.width, 596);
  assert.equal(set.height, 512);
  assert.equal(set.x, 900);
  assert.equal(set.y, 700);
});

test('ignores non-component-set selections', () => {
  const node = { type: 'FRAME', children: [] };
  const messages = runPlugin([node]);
  assert.equal(messages[0], '정리할 컴포넌트 세트를 선택하세요.');
});

test('processes multiple sets and reports empty and locked sets', () => {
  const variant = { x: 10, y: 20, width: 40, height: 30 };
  const set = {
    type: 'COMPONENT_SET', children: [variant],
    resize(width, height) { this.width = width; this.height = height; },
  };
  const empty = { type: 'COMPONENT_SET', children: [], resize() {} };
  const locked = { type: 'COMPONENT_SET', locked: true, children: [variant], resize() {} };

  const messages = runPlugin([set, empty, locked]);

  assert.equal(messages[0], '정리 1개 / 빈 세트 1개 / 실패 1개');
  assert.equal(variant.x, 200);
  assert.equal(variant.y, 200);
});

test('does not resize or move a set with a locked child', () => {
  const children = [
    { x: 10, y: 20, width: 40, height: 30 },
    { x: 60, y: 20, width: 40, height: 30, locked: true },
  ];
  const set = {
    type: 'COMPONENT_SET', width: 200, height: 100, children,
    resize(width, height) { this.width = width; this.height = height; },
  };

  const messages = runPlugin([set]);

  assert.equal(messages[0], '정리 0개 / 빈 세트 0개 / 실패 1개');
  assert.equal(set.width, 200);
  assert.equal(set.height, 100);
  assert.equal(children[0].x, 10);
  assert.equal(children[0].y, 20);
  assert.equal(children[1].x, 60);
  assert.equal(children[1].y, 20);
});
