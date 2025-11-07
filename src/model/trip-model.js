import { destinationMock } from '../mock/destinations-mock.js';
import { offersMock } from '../mock/offers-mock.js';
import { pointsMock } from '../mock/points-mock.js';

export default class TripModel {
  destination = destinationMock;
  offers = offersMock;
  points = pointsMock;

  get destinationData() {
    return this.destination;
  }

  get offersData() {
    return this.offers;
  }

  get pointsData() {
    return this.points;
  }
}
