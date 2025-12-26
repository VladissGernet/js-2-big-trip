import ListView from '../view/list-view/list-view.js';
import ListWaypointView from '../view/list-view/list-waypoint-view.js';
import ListWaypointFormView from '../view/list-view/list-waypoint-form-view.js';

import { render, replace, RenderPosition } from '../framework/render.js';

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

    /* TODO
      Проверить как выглядит форма создания и форма редактирования в шаблонах html.

      Остановился на добавления обработчика на кнопку редактирования (rollup)
      Сделать подробную документацию данных, которые принимают элементы
      waypointForm не создается из-за неверных данных offerTypeData
      Заменить с     render(waypointForm, element); на render(wayPoint, element);


      Еще переделать форму submit , для добавления новой точки wayPoint
    */

    const filteredOfferData = pointData.offers.reduce((acc, offer) => {
      acc.push(offerTypeData[offer]);
      return acc;
    }, []);

    const wayPoint = new ListWaypointView({
      listPoint: pointData,
      destinationData: destinationData,
      offerData: filteredOfferData,
      onRollupClick: (evt) => {
        evt.preventDefault();
        // replaceWaypointToForm();
      },
    });

    const waypointForm = new ListWaypointFormView({
      listPoint: pointData,
      destinationData: destinationData,
      listOffers: offerTypeData,
    });

    // function replaceWaypointToForm() {
    //   replace(wayPoint, waypointForm);
    // }

    // function replaceFormToWaypoint() {
    //   replace();
    // }

    render(waypointForm, element);
  }
};

/**
 * Презентер списка. Отвечает за рендеринг компонента Списка.
 */
export default class ListPresenter {
  /** @type {ListView} Контейнер для списка путевых точек */
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

  /** Инициализация презентера */
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

    // const firstWayPointForBegin = listPoints[0];
    // const firstDestinationData =
    //   destinationsById[firstWayPointForBegin.destination];
    // const firstOffersTypeData = offersByType[firstWayPointForBegin.type];
    // render(
    //   new ListWaypointFormView({
    //     listPoint: firstWayPointForBegin,
    //     destinationData: firstDestinationData,
    //     listOffers: firstOffersTypeData,
    //   }),
    //   this.#listView.element,
    //   RenderPosition.AFTERBEGIN
    // );
  }
}
