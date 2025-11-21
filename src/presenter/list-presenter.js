import ListView from '../view/list-view/list-view.js';
import ListWaypointView from '../view/list-view/list-waypoint-view.js';
import ListCreationFormView from '../view/list-view/list-creation-form-view.js';

import { render } from '../utils/render.js';

export default class ListPresenter {
  list = new ListView();
  listCreationFormView = new ListCreationFormView();

  constructor({ container, tripModel }) {
    this.container = container;
    this.tripModel = tripModel;
  }

  init() {
    this.listPoints = [...this.tripModel.getPoints()];
    this.listDestinations = { ...this.tripModel.getDestinationsById() };
    this.listOffers = { ...this.tripModel.getOffersByType() };

    console.log(this.listDestinations);

    render(this.list, this.container);
    render(this.listCreationFormView, this.list.getElement());

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
      render(newWayPoint, this.list.getElement());
    }
  }
}
