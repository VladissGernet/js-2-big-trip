/** Подсчет конечной стоимости с учетом выбранных предложений
 * @param offersByType - Все предложения по типу, например: tripModel.offersByType.get(type).
 * @param basePrice - Базовая стоимость. Например, берем из данных basePrice.
 * @param offers - Выбранные предложения текущей точки. Например, берем из данных offers (Коллекция Set).
 */
const calcFinalPrice = (offersByType, basePrice, offers) => {
  let finalPrice = Number(basePrice);
  if (!offers.size) {
    return finalPrice;
  }
  offers.forEach((offerId) => (finalPrice += offersByType.get(offerId).price));
  return finalPrice;
};

export { calcFinalPrice };
