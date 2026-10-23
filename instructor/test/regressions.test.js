import { expect, test } from 'vitest';
import { calculateDelivery } from '../src/calculateDelivery.js';

test('B1: стандартная доставка при сумме ровно 3000 бесплатна', () => {
  expect(calculateDelivery({
    total: 3000,
    isPremium: false,
    deliveryType: 'standard',
    promoCode: null,
  })).toBe(0);
});

test('B2: Premium сам по себе даёт бесплатную стандартную доставку', () => {
  expect(calculateDelivery({
    total: 1000,
    isPremium: true,
    deliveryType: 'standard',
    promoCode: null,
  })).toBe(0);
});

test('B3: промокод в нижнем регистре не даёт бесплатную доставку', () => {
  expect(calculateDelivery({
    total: 1000,
    isPremium: false,
    deliveryType: 'standard',
    promoCode: 'freeship',
  })).toBe(350);
});

test('B4: большой заказ с промокодом и Premium не удешевляет экспресс', () => {
  expect(calculateDelivery({
    total: 5000,
    isPremium: true,
    deliveryType: 'express',
    promoCode: 'FREESHIP',
  })).toBe(700);
});

test('B5: нулевая сумма допустима', () => {
  expect(calculateDelivery({
    total: 0,
    isPremium: false,
    deliveryType: 'standard',
    promoCode: null,
  })).toBe(350);
});

test('B6: числовая строка вызывает TypeError', () => {
  expect(() => calculateDelivery({
    total: '1000',
    deliveryType: 'standard',
  })).toThrow(TypeError);
});

test('B7: отрицательная сумма вызывает RangeError', () => {
  expect(() => calculateDelivery({
    total: -1,
    deliveryType: 'standard',
  })).toThrow(RangeError);
});

test('B8: неизвестная доставка вызывает RangeError', () => {
  expect(() => calculateDelivery({
    total: 1000,
    deliveryType: 'pickup',
  })).toThrow(RangeError);
});
