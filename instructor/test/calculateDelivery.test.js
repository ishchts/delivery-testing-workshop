import { describe, expect, test } from 'vitest';
import { calculateDelivery } from '../src/calculateDelivery.js';

describe('стандартная доставка', () => {
  test.each([
    [0, 350],
    [0.01, 350],
    [2999, 350],
    [2999.99, 350],
    [3000, 0],
    [3000.01, 0],
    [3001, 0],
  ])('сумма %s рублей → доставка %s рублей', (total, expected) => {
    expect(calculateDelivery({
      total,
      isPremium: false,
      deliveryType: 'standard',
      promoCode: null,
    })).toBe(expected);
  });

  test.each([0, 1000, 2999.99, 3000])(
    'Premium: доставка при сумме %s бесплатна',
    (total) => {
      expect(calculateDelivery({
        total,
        isPremium: true,
        deliveryType: 'standard',
      })).toBe(0);
    },
  );

  test.each([0, 1000, 2999.99, 3000])(
    'FREESHIP: доставка при сумме %s бесплатна',
    (total) => {
      expect(calculateDelivery({
        total,
        deliveryType: 'standard',
        promoCode: 'FREESHIP',
      })).toBe(0);
    },
  );

  test.each([null, '', 'OTHER', 'freeship', 'FreeShip', ' FREESHIP', 'FREESHIP '])(
    'промокод %j не даёт скидку',
    (promoCode) => {
      expect(calculateDelivery({
        total: 1000,
        isPremium: false,
        deliveryType: 'standard',
        promoCode,
      })).toBe(350);
    },
  );

  test('два основания для бесплатной доставки не делают цену отрицательной', () => {
    expect(calculateDelivery({
      total: 1000,
      isPremium: true,
      deliveryType: 'standard',
      promoCode: 'FREESHIP',
    })).toBe(0);
  });

  test('пропущенные необязательные поля получают значения по умолчанию', () => {
    expect(calculateDelivery({ total: 1000 })).toBe(350);
  });

  test('undefined в необязательных полях включает значения по умолчанию', () => {
    expect(calculateDelivery({
      total: 1000,
      isPremium: undefined,
      deliveryType: undefined,
      promoCode: undefined,
    })).toBe(350);
  });
});

describe('экспресс-доставка', () => {
  // Каждое сочетание проверяет независимость цены от трёх факторов.
  for (const total of [0, 1000, 3000, 5000]) {
    for (const isPremium of [false, true]) {
      test.each([null, 'FREESHIP', 'freeship'])(
        `сумма ${total}, Premium ${isPremium}, промокод %j → 700 рублей`,
        (promoCode) => {
          expect(calculateDelivery({
            total,
            isPremium,
            deliveryType: 'express',
            promoCode,
          })).toBe(700);
        },
      );
    }
  }
});

describe('проверка суммы', () => {
  test.each([
    ['undefined', undefined],
    ['null', null],
    ['числовая строка', '1000'],
    ['строковый ноль', '0'],
    ['пустая строка', ''],
    ['строка с текстом', 'нет суммы'],
    ['true', true],
    ['false', false],
    ['пустой массив', []],
    ['массив с числом', [1000]],
    ['объект', {}],
    ['NaN', NaN],
    ['Infinity', Infinity],
    ['-Infinity', -Infinity],
  ])('%s вызывает TypeError', (_label, total) => {
    expect(() => calculateDelivery({ total })).toThrow(TypeError);
  });

  test('объект без total вызывает TypeError', () => {
    expect(() => calculateDelivery({})).toThrow(TypeError);
  });

  test('вызов без аргументов вызывает TypeError', () => {
    expect(() => calculateDelivery()).toThrow(TypeError);
  });

  test.each([-0.01, -1, -3000])('%s вызывает RangeError', (total) => {
    expect(() => calculateDelivery({ total })).toThrow(RangeError);
  });

  test.each([
    ['числовая строка', '1000', TypeError],
    ['NaN', NaN, TypeError],
    ['Infinity', Infinity, TypeError],
    ['отрицательное число', -1, RangeError],
  ])('экспресс со льготами: %s всё равно отклоняется', (_label, total, error) => {
    expect(() => calculateDelivery({
      total,
      isPremium: true,
      deliveryType: 'express',
      promoCode: 'FREESHIP',
    })).toThrow(error);
  });
});

describe('проверка типа доставки', () => {
  test.each(['pickup', 'Standard', 'EXPRESS', '', null, 700])(
    'неизвестный тип %j вызывает RangeError',
    (deliveryType) => {
      expect(() => calculateDelivery({ total: 1000, deliveryType }))
        .toThrow(RangeError);
    },
  );

  test.each([
    [5000, false, null],
    [1000, true, null],
    [1000, false, 'FREESHIP'],
  ])('льготы не разрешают неизвестную доставку: %s / %s / %s',
    (total, isPremium, promoCode) => {
      expect(() => calculateDelivery({
        total,
        isPremium,
        deliveryType: 'pickup',
        promoCode,
      })).toThrow(RangeError);
    },
  );
});
