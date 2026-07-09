const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function loadApp() {
  const store = new Map();
  const noopElement = {
    addEventListener() {},
    classList: { add() {}, remove() {}, toggle() {} },
    dataset: {},
    innerHTML: "",
    textContent: "",
    value: "",
  };

  const context = {
    console,
    localStorage: {
      getItem(key) {
        return store.has(key) ? store.get(key) : null;
      },
      setItem(key, value) {
        store.set(key, String(value));
      },
      removeItem(key) {
        store.delete(key);
      },
    },
    document: {
      addEventListener() {},
      querySelector() {
        return null;
      },
      querySelectorAll() {
        return [];
      },
    },
    IntersectionObserver: class {
      observe() {}
      unobserve() {}
    },
  };

  vm.createContext(context);
  const source = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");
  vm.runInContext(source, context);
  return { context, noopElement };
}

test("toggleFavorite stores and removes a pattern by name", () => {
  const { context } = loadApp();
  const pattern = { name: "莲花纹", type: "植物纹样", period: "唐代", place: "敦煌", cls: "pattern-lotus", text: "测试说明" };

  assert.equal(context.toggleFavorite(pattern), true);
  assert.equal(JSON.stringify(context.getFavorites().map((item) => item.name)), JSON.stringify(["莲花纹"]));

  assert.equal(context.toggleFavorite(pattern), false);
  assert.equal(JSON.stringify(context.getFavorites()), JSON.stringify([]));
});

test("favorites are ordered with the most recent first", () => {
  const { context } = loadApp();
  const lotus = { name: "莲花纹", type: "植物纹样", period: "唐代", place: "敦煌", cls: "pattern-lotus", text: "测试说明" };
  const vine = { name: "忍冬纹", type: "植物纹样", period: "北朝至唐", place: "龟兹", cls: "pattern-vine", text: "测试说明" };

  context.toggleFavorite(lotus);
  context.toggleFavorite(vine);

  assert.equal(JSON.stringify(context.getFavorites().map((item) => item.name)), JSON.stringify(["忍冬纹", "莲花纹"]));
});
