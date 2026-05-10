import { transformOfferTypeData } from './index.js';

const createViewPointData = ({ tripModel, pointData }) => {
  const { destination, type, offers } = pointData;
  const destinationData = tripModel.destinationsById.get(destination);

  const transformedOfferTypeData = transformOfferTypeData({
    allOffers: tripModel.offersByType.get(type),
    selectedOffers: offers,
  });

  return {
    listPoint: pointData,
    destinationData: destinationData,
    offerData: transformedOfferTypeData,
  };
};

export { createViewPointData };
