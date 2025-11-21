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
    return [...this.destinations].reduce((acc, { id, ...rest }) => {
      acc[id] = rest;
      return acc;
    }, {});
  }

  getOffersByType() {
    // Преобразовываю данные для оптимизированного поиска.
    return [...this.offers].reduce(
      (acc, { type, offers }) => ({
        ...acc,
        [type]: offers.reduce(
          (offersResult, { id, ...rest }) => ({
            ...offersResult,
            [id]: rest,
          }),
          {}
        ),
      }),
      {}
    );
  }

  getPoints() {
    return this.points;
  }
}
