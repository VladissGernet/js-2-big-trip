import { destinationsMock } from '../mock/destinations-mock.js';
import { offersMock } from '../mock/offers-mock.js';
import { pointsMock } from '../mock/points-mock.js';
import { replaceSnakeToCamel } from '../utils/replace-snake-to-camel.js';

export default class TripModel {
  destinations = destinationsMock;
  offers = offersMock;
  points = replaceSnakeToCamel(pointsMock);

  getDestinationsById() {
    // Преобразовываю данные для оптимизированного поиска.
    return structuredClone(this.destinations).reduce((acc, { id, ...rest }) => {
      acc[id] = rest;
      return acc;
    }, {});
  }

  getOffersByType() {
    // Преобразовываю данные для оптимизированного поиска.
    return structuredClone(this.offers).reduce((types, { type, offers }) => {
      types[type] = offers.reduce((offersIdentifications, { id, ...rest }) => {
        offersIdentifications[id] = rest;
        return offersIdentifications;
      }, {});
      return types;
    }, {});
  }

  getPoints() {
    return structuredClone(this.points);
  }
}
