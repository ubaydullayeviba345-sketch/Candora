import test from "node:test";
import assert from "node:assert/strict";
import {
  isValidEmail,
  generatePromoCode,
  drawPrize,
  PRIZE_TIERS,
} from "./lottery.ts";

test("isValidEmail: validates valid email addresses", () => {
  assert.equal(isValidEmail("user@example.com"), true);
  assert.equal(isValidEmail("client.name+test@candora.uz"), true);
  assert.equal(isValidEmail("  admin@domain.co  "), true);
});

test("isValidEmail: rejects invalid email addresses", () => {
  assert.equal(isValidEmail(""), false);
  assert.equal(isValidEmail("notanemail"), false);
  assert.equal(isValidEmail("missingdomain@"), false);
  assert.equal(isValidEmail("@nodomain.com"), false);
  assert.equal(isValidEmail("spaces in@email.com"), false);
});

test("generatePromoCode: produces valid CANDORA- format", () => {
  const code = generatePromoCode();
  assert.ok(code.startsWith("CANDORA-"));
  assert.equal(code.length, 14); // CANDORA- (8) + 6 chars = 14
});

test("drawPrize: deterministic percentage threshold tests", () => {
  // 0 .. 10 -> cake (10%)
  const prizeCake = drawPrize(5);
  assert.equal(prizeCake.id, "cake");
  assert.equal(prizeCake.percentage, 10);

  // 10 .. 30 -> pastry (20%)
  const prizePastry = drawPrize(15);
  assert.equal(prizePastry.id, "pastry");
  assert.equal(prizePastry.percentage, 20);

  // 30 .. 35 -> trend_sweet (5%)
  const prizeTrend = drawPrize(32);
  assert.equal(prizeTrend.id, "trend_sweet");
  assert.equal(prizeTrend.percentage, 5);

  // 35 .. 100 -> promo50k (65%)
  const prizePromo = drawPrize(75);
  assert.equal(prizePromo.id, "promo50k");
  assert.equal(prizePromo.percentage, 65);
  assert.ok(prizePromo.promoCode?.startsWith("CANDORA-"));
});

test("drawPrize: 100% win guarantee (never returns null/undefined)", () => {
  for (let i = 0; i < 500; i++) {
    const prize = drawPrize();
    assert.ok(prize !== null && prize !== undefined);
    assert.ok(["cake", "pastry", "trend_sweet", "promo50k"].includes(prize.id));
    assert.ok(prize.name.uz.length > 0);
  }
});

test("drawPrize: statistical distribution approximation over 10,000 draws", () => {
  const counts: Record<string, number> = {
    cake: 0,
    pastry: 0,
    trend_sweet: 0,
    promo50k: 0,
  };

  const total = 10000;
  for (let i = 0; i < total; i++) {
    const p = drawPrize();
    counts[p.id]++;
  }

  // Check that cake is roughly 10% (+- 3%)
  const cakePct = (counts.cake / total) * 100;
  assert.ok(cakePct >= 7 && cakePct <= 13, `Cake percentage ${cakePct} out of bounds`);

  // Check that pastry is roughly 20% (+- 4%)
  const pastryPct = (counts.pastry / total) * 100;
  assert.ok(pastryPct >= 16 && pastryPct <= 24, `Pastry percentage ${pastryPct} out of bounds`);

  // Check that trend_sweet is roughly 5% (+- 2.5%)
  const trendPct = (counts.trend_sweet / total) * 100;
  assert.ok(trendPct >= 2.5 && trendPct <= 7.5, `Trend sweet percentage ${trendPct} out of bounds`);

  // Check that promo50k is roughly 65% (+- 5%)
  const promoPct = (counts.promo50k / total) * 100;
  assert.ok(promoPct >= 60 && promoPct <= 70, `Promo50k percentage ${promoPct} out of bounds`);
});

