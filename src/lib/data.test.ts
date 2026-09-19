import test from "node:test";
import assert from "node:assert/strict";
import {
  formatPrice,
  formatPhone,
  formatCardNumber,
  formatExpiry,
} from "./data.ts";

test("formatPrice: formats USD, UZS, and RUB correctly", () => {
  // USD
  assert.equal(formatPrice(10, "en"), "$10");
  // UZS (10 * 12500 = 125 000 so'm)
  const uzs = formatPrice(10, "uz");
  assert.ok(uzs.includes("so'm"));
  assert.ok(uzs.replace(/\s/g, "").includes("125000"));
  // RUB (10 * 90 = 900 ₽)
  const rub = formatPrice(10, "ru");
  assert.ok(rub.includes("900"));
});

test("formatPhone: standardizes Uzbekistan phone numbers", () => {
  assert.equal(formatPhone("901234567"), "+998 90 123 45 67");
  assert.equal(formatPhone("+998901234567"), "+998 90 123 45 67");
  assert.equal(formatPhone(""), "+998 ");
});

test("formatCardNumber: spaces every 4 digits up to 16", () => {
  assert.equal(formatCardNumber("8600123456789012"), "8600 1234 5678 9012");
  assert.equal(formatCardNumber("86001234"), "8600 1234");
});

test("formatExpiry: formats MM/YY properly", () => {
  assert.equal(formatExpiry("1228"), "12/28");
  assert.equal(formatExpiry("05"), "05");
});

