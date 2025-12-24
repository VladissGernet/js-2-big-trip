import ListView from '../view/list-view/list-view.js';
import ListWaypointView from '../view/list-view/list-waypoint-view.js';
import ListCreationFormView from '../view/list-view/list-creation-form-view.js';

import { render, RenderPosition } from '../framework/render.js';

/**
 * Создание динамического списка путевых точек
 * @param {Array<Object>} listPoints Массив из объектов с данными путевых точек
 * @param {Object<id, Object>} destinationsById Объект с данными о назначениях по ID
 * @param {Object<id, Object>} offersByType Объект с данными о предложениях по типу
 * @param {HTMLUlElement} element Контейнер для списка путевых точек
 */
const createList = ({
  listPoints,
  destinationsById,
  offersByType,
  element,
}) => {
  for (let i = 0; i < listPoints.length; i++) {
    const pointData = listPoints[i];

    const destinationData = destinationsById[pointData.destination];

    const offerTypeData = offersByType[pointData.type];

    const filteredOfferData = pointData.offers.reduce((acc, offer) => {
      acc.push(offerTypeData[offer]);
      return acc;
    }, []);

    const newWayPoint = new ListWaypointView({
      listPoint: pointData,
      destinationData: destinationData,
      offerData: filteredOfferData,
    });
    render(newWayPoint, element);
  }
};

export default class ListPresenter {
  /**
   * @type {ListView}
   * Контейнер для списка путевых точек
   */
  #listView = new ListView();

  /** @type {HTMLElement} Контейнер */
  #container = null;

  /**
   * @typedef {Object} TripModel
   * @property {Array} listPoints - Список путевых точек
   * @property {Object} destinationsById - Назначения по ID
   * @property {Object} offersByType - Предложения по типу
   */

  /** @type {TripModel} Модель поездки */
  #tripModel = null;

  constructor({ container, tripModel }) {
    this.#container = container;
    this.#tripModel = tripModel;
  }

  /**
   * Инициализация презентера
   */
  init() {
    const { listPoints, destinationsById, offersByType } = this.#tripModel;
    render(this.#listView, this.#container);

    // Создание динамического списка.
    createList({
      listPoints: listPoints,
      destinationsById: destinationsById,
      offersByType: offersByType,
      element: this.#listView.element,
    });

    // Добавление формы создания путевой точки.
    // На первое время добавляю просто первую точку из исписка.
    const firstWayPointForBegin = listPoints[0];
    const firstDestinationData =
      destinationsById[firstWayPointForBegin.destination];
    const firstOffersTypeData = offersByType[firstWayPointForBegin.type];

    render(
      new ListCreationFormView({
        listPoint: firstWayPointForBegin,
        destinationData: firstDestinationData,
        listOffers: firstOffersTypeData,
      }),
      this.#listView.element,
      RenderPosition.AFTERBEGIN
    );
  }
}
