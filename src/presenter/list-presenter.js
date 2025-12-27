import ListView from '../view/list-view/list-view.js';
import ListWaypointView from '../view/list-view/list-waypoint-view.js';
import ListWaypointFormView from '../view/list-view/list-waypoint-form-view.js';

import { render, replace } from '../framework/render.js';

/**
 * Модель точки маршрута (event point) для планировщика поездок.
 * @typedef {Object} PointData
 * @property {string} id - Уникальный идентификатор точки (UUID).
 * @property {number} basePrice - Базовая цена услуги в рублях.
 * @property {string} dateFrom - Дата и время начала события в формате ISO 8601 (UTC).
 * @property {string} dateTo - Дата и время окончания события в формате ISO 8601 (UTC).
 * @property {string} destination - Идентификатор пункта назначения (UUID).
 * @property {boolean} isFavorite - Флаг избранного события.
 * @property {string[]} offers - Массив идентификаторов доступных предложений/опций (UUID).
 * @property {string} type - Тип события: 'check-in', 'taxi', 'sightseeing', 'flight' и т.д.
 */

/**
 * Модель изображения пункта назначения.
 * @typedef {Object} DestinationPicture
 * @property {string} src - URL изображения (абсолютная ссылка).
 * @property {string} description - Описание изображения для доступности (alt-текст).
 */

/**
 * Модель пункта назначения (destination) для планировщика поездок.
 * @typedef {Object} DestinationData
 * @property {string} description - Полное описание города/места.
 * @property {string} name - Название пункта назначения.
 * @property {DestinationPicture[]} pictures - Массив изображений пункта назначения.
 */

/**
 * Модель отдельного предложения/опции.
 * @typedef {Object} OfferTypeData
 * @property {string} title - Название предложения (на английском).
 * @property {number} price - Цена предложения в рублях.
 */

/**
 * Словарь предложений по типу события.
 * Ключ — UUID предложения, значение — данные предложения.
 * @typedef {Object<string, OfferTypeData>} OffersByTypeData
 */

/**
 * Создание DOM-элемента путевой точки.
 * Связывает данные PointData, DestinationData и offerTypeData в готовый компонент.
 *
 * @param {Object} params - Параметры создания точки
 * @param {PointData} params.pointData - Данные точки маршрута (id, price, dates, type)
 * @param {DestinationData} params.destinationData - Данные пункта назначения (name, pictures)
 * @param {OfferTypeData} params.offerTypeData - Данные типов предложений для точки
 * @param {HTMLUListElement} params.element - Контейнер для рендера компонента
 *
 * @returns {HTMLElement} Созданный DOM-элемент путевой точки
 */
const createWayPoint = ({
  pointData,
  destinationData,
  offerTypeData,
  element,
}) => {
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

  const waypointForm = new ListWaypointFormView({
    listPoint: pointData,
    destinationData: destinationData,
    listOffers: offerTypeData,
  });

  const wayPoint = new ListWaypointView({
    listPoint: pointData,
    destinationData: destinationData,
    offerData: filteredOfferData,
    onRollupClick: (evt) => {
      evt.preventDefault();
      replaceWaypointToForm();
    },
  });

  function replaceWaypointToForm() {
    replace(waypointForm, wayPoint);
  }

  // function replaceFormToWaypoint(waypointForm, wayPoint) {
  //   replace();
  // }

  render(wayPoint, element);
};

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
    createWayPoint({
      pointData: listPoints[i],
      destinationData: destinationsById[listPoints[i].destination],
      offerTypeData: offersByType[listPoints[i].type],
      element: element,
    });
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
