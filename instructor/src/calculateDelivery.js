export function calculateDelivery({
  total,
  isPremium = false,
  deliveryType = 'standard',
  promoCode = null,
} = {}) {
  if (typeof total !== 'number' || !Number.isFinite(total)) {
    throw new TypeError('Сумма заказа должна быть конечным числом');
  }

  if (total < 0) {
    throw new RangeError('Сумма заказа не может быть отрицательной');
  }

  if (deliveryType !== 'standard' && deliveryType !== 'express') {
    throw new RangeError('Неизвестный тип доставки');
  }

  if (deliveryType === 'express') {
    return 700;
  }

  if (total >= 3000 || isPremium === true || promoCode === 'FREESHIP') {
    return 0;
  }

  return 350;
}
