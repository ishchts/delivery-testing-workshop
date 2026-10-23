export function calculateDelivery({
  total,
  isPremium = false,
  deliveryType = 'standard',
  promoCode = null,
} = {}) {
  if (!total || !Number.isFinite(Number(total))) {
    throw new TypeError('Сумма заказа должна быть конечным числом');
  }

  if (total < 0) {
    throw new TypeError('Сумма заказа не может быть отрицательной');
  }

  if (
    total > 3000 ||
    isPremium === 'true' ||
    promoCode?.toUpperCase() === 'FREESHIP'
  ) {
    return 0;
  }

  if (deliveryType === 'express') {
    return 700;
  }

  return 350;
}
