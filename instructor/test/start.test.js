import { expect, test } from 'vitest';
import { calculateDelivery } from '../src/calculateDelivery.js';

test('обычная стандартная доставка стоит 350 рублей', () => {
  expect(calculateDelivery({
    total: 1000,
    isPremium: false,
    deliveryType: 'standard',
    promoCode: null,
  })).toBe(350);
});

test('стандартная доставка большого заказа бесплатна', () => {
  expect(calculateDelivery({
    total: 5000,
    isPremium: false,
    deliveryType: 'standard',
    promoCode: null,
  })).toBe(0);
});
