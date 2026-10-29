import { test } from "vitest";
import assert from "node:assert/strict";
import * as dates from "@/lib/fa/jalali";
import * as pipeline from "@/lib/crm/pipeline";
import { dedupeById } from "@/lib/crm/collections";
import { saveDealOrder, orderDealsBySavedOrder } from "@/lib/crm/deal-order";

test("Jalali conversion round trips Nowruz and leap-year Esfand", () => {
  for (const [jy, jm, jd] of [[1403, 12, 30], [1404, 1, 1], [1405, 8, 6]]) {
    assert.deepEqual(dates.toJalaliParts(dates.fromJalaliParts(jy, jm, jd)), { jy, jm, jd });
  }
  assert.equal(dates.jalaliMonthLength(1403, 12), 30);
  assert.equal(dates.jalaliMonthLength(1404, 12), 29);
});

test("all pipeline entry points share the same stage probabilities", () => {
  const expected = [30, 50, 70, 85, 100];
  pipeline.DEFAULT_PIPELINE_STAGES.forEach((stage, index) => {
    assert.equal(pipeline.probabilityForStage(pipeline.DEFAULT_PIPELINE_STAGES, stage.id), expected[index]);
  });
  const custom = [{ ...pipeline.DEFAULT_PIPELINE_STAGES[0], id: "custom", title: "موفق و نهایی" }];
  assert.equal(pipeline.isWonStage(custom, "custom"), true);
  assert.equal(pipeline.probabilityForStage([], "missing"), 30);
});

test("deduplication preserves the first record and input order", () => {
  const first = { id: "a", value: 1 };
  const records = [first, { id: "a", value: 2 }, { id: "b" }];
  assert.deepEqual(dedupeById(records), [first, { id: "b" }]);
  assert.equal(records.length, 3);
});

function memoryStorage() {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
}

test("deal order is isolated by workspace and retains new records", () => {
  const storage = memoryStorage();
  const deals = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }];
  saveDealOrder([{ id: "b" }, { id: "a" }], "workspace:one", storage);
  assert.deepEqual(orderDealsBySavedOrder(deals, "workspace:one", storage).map((item) => item.id), ["b", "a", "c", "d"]);
  assert.deepEqual(orderDealsBySavedOrder(deals, "workspace:two", storage), deals);
  assert.equal(deals[0].id, "a");
});

test("corrupt and unavailable order storage cannot break the pipeline", () => {
  const deals = [{ id: "a" }];
  for (const raw of ["null", "{}", "[1]", "bad json"]) {
    assert.deepEqual(orderDealsBySavedOrder(deals, "one", { getItem: () => raw, setItem: () => {} }), deals);
  }
  const unavailable = { getItem() { throw Error("disabled"); }, setItem() { throw Error("full"); } };
  assert.deepEqual(orderDealsBySavedOrder(deals, "one", unavailable), deals);
  assert.doesNotThrow(() => saveDealOrder(deals, "one", unavailable));
});
