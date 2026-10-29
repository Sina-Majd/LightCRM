import { test } from "vitest";
import assert from "node:assert/strict";
import * as dates from "@/lib/fa/jalali";

test("Jalali conversion round trips Nowruz and leap-year Esfand", () => {
  for (const [jy, jm, jd] of [[1403, 12, 30], [1404, 1, 1], [1405, 8, 6]]) {
    assert.deepEqual(dates.toJalaliParts(dates.fromJalaliParts(jy, jm, jd)), { jy, jm, jd });
  }
  assert.equal(dates.jalaliMonthLength(1403, 12), 30);
  assert.equal(dates.jalaliMonthLength(1404, 12), 29);
});
