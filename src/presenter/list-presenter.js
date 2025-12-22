import ListView from '../view/list-view/list-view.js';
import ListWaypointView from '../view/list-view/list-waypoint-view.js';
import ListCreationFormView from '../view/list-view/list-creation-form-view.js';

import { render, RenderPosition } from '../framework/render.js';

export default class ListPresenter {
  list = new ListView();
  constructor({ container, tripModel }) {
    this.container = container;
    this.tripModel = tripModel;
  }

  init() {
    this.listPoints = this.tripModel.listPoints;
    this.listDestinations = this.tripModel.destinationsById;
    this.listOffers = this.tripModel.offersByType;

    render(this.list, this.container);

    // Создание динамического списка.
    for (let i = 0; i < this.listPoints.length; i++) {
      const pointData = this.listPoints[i];

      const destinationData = this.listDestinations[pointData.destination];

      const offerTypeData = this.listOffers[pointData.type];

      const filteredOfferData = pointData.offers.reduce((acc, offer) => {
        acc.push(offerTypeData[offer]);
        return acc;
      }, []);

      const newWayPoint = new ListWaypointView({
        listPoint: pointData,
        destinationData: destinationData,
        offerData: filteredOfferData,
      });
      render(newWayPoint, this.list.element);
    }

    // Добавление формы создания путевой точки.
    // На первое время добавляю просто первую точку из исписка.
    const firstWayPointForBegin = this.listPoints[0];
    const firstDestinationData =
      this.listDestinations[firstWayPointForBegin.destination];
    const firstOffersTypeData = this.listOffers[firstWayPointForBegin.type];

    render(
      new ListCreationFormView({
        listPoint: firstWayPointForBegin,
        destinationData: firstDestinationData,
        listOffers: firstOffersTypeData,
      }),
      this.list.element,
      RenderPosition.AFTERBEGIN
    );
  }
}
