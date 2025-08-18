import { randInt, randItem } from "./util";

describe("util.randInt", () => {
  test("returns integer within bounds inclusive", () => {
    for (let i = 0; i < 100; i++) {
      const v = randInt(1, 3);
      expect([1, 2, 3]).toContain(v);
    }
  });
});

describe("util.randItem", () => {
  test("returns one of the items", () => {
    const arr = ["a", "b", "c"];
    const item = randItem(arr);
    expect(arr).toContain(item);
  });
});
