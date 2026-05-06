import { calcFinalPrice, transformOfferTypeData } from './index.js';

const createViewPointData = ({ tripModel, pointData, isFormData = false }) => {
  const { destination, type, offers, basePrice } = pointData;
  const destinationData = tripModel.destinationsById.get(destination);

  const transformedOfferTypeData = transformOfferTypeData({
    allOffers: tripModel.offersByType.get(type),
    selectedOffers: offers,
  });

  if (!isFormData) {
    // TODO вот это возможно лишний подсчет
    // Подсчет полной стоимсти с учетом добавления надбавок от offer.
    const pointCopy = structuredClone(pointData);
    pointCopy.basePrice = calcFinalPrice(
      tripModel.offersByType.get(type),
      basePrice,
      offers,
    );

    return {
      listPoint: pointCopy,
      destinationData: destinationData,
      offerData: transformedOfferTypeData,
    };
  }

  return {
    listPoint: pointData,
    destinationData: destinationData,
    offerData: transformedOfferTypeData,
  };
};

export { createViewPointData };
