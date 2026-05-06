/** Преобразует данные из коллекции Map в массив предложений точки и дабавляет флаги выбранного предложения. */
const transformOfferTypeData = ({ allOffers, selectedOffers = null }) =>
  Array.from(allOffers, ([id, offerData]) => ({
    ...offerData,
    isSelected: selectedOffers ? selectedOffers.has(id) : false,
  }));

export { transformOfferTypeData };
