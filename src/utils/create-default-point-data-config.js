/** Данные создания формы по умолчанию */
const createDefaultPointDataConfig = (type) => {
  const today = new Date().toISOString();
  return {
    basePrice: '',
    dateFrom: today,
    dateTo: today,
    destination: '',
    isFavorite: false,
    offers: new Map(),
    type,
  };
};

export { createDefaultPointDataConfig };
