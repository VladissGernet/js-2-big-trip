import ListView from '../view/list-view/list-view.js';
import ListWaypointView from '../view/list-view/list-waypoint-view.js';
import ListWaypointFormView from '../view/list-view/list-waypoint-form-view.js';
import { render, replace } from '../framework/render.js';

/** Модель точки маршрута (event point) для планировщика поездок.
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

/** Модель изображения пункта назначения.
 * @typedef {Object} DestinationPicture
 * @property {string} src - URL изображения (абсолютная ссылка).
 * @property {string} description - Описание изображения для доступности (alt-текст).
 */

/** Модель пункта назначения (destination) для планировщика поездок.
 * @typedef {Object} DestinationData
 * @property {string} description - Полное описание города/места.
 * @property {string} name - Название пункта назначения.
 * @property {DestinationPicture[]} pictures - Массив изображений пункта назначения.
 */

/** Модель отдельного предложения/опции.
 * @typedef {Object} OfferTypeData
 * @property {string} title - Название предложения (на английском).
 * @property {number} price - Цена предложения в рублях.
 */

/** Словарь предложений по типу события.
 * Ключ — UUID предложения, значение — данные предложения.
 * @typedef {Object<string, OfferTypeData>} OffersByTypeData
 */

/** Модель данных поездки.
 * @typedef {Object} TripModel
 * @property {PointData[]} listPoints - Список путевых точек
 * @property {Object<string, DestinationData>} destinationsById - Назначения по ID
 * @property {Object<string, ListOffers>} offersByType - Предложения по типу
 */

/** Конфигурация презентера списка.
 * @typedef {Object} PresenterConfig
 * @property {HTMLElement} container - Контейнер для рендера
 * @property {TripModel} tripModel - Модель данных поездки
 */

/** Объект предложений по UUID. Ключи — идентификаторы предложений.
 * @typedef {Object<string, OfferTypeData>} ListOffers
 */

/** Создание DOM-элемента путевой точки.
 * Связывает данные PointData, DestinationData и offerTypeData в готовый компонент.
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
      Остановился на добавления обработчика на кнопку редактирования (rollup)
      Сделать подробную документацию данных, которые принимают элементы
      waypointForm не создается из-за неверных данных offerTypeData
      Заменить с     render(waypointForm, element); на render(wayPoint, element);
      Обратить внимание на кнопку редактирования, где есть стрелка вверх закрытия!
      В формах есть наличие и отсутсвие стрелочки вверх, а такаже есть кнопки delete и пр.

      Добавил закрытие на rollup close


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
    isEditForm: true,
  });

  const onCloseRollupBtnClick = (evt) => {
    evt.preventDefault();
    replaceFormToWaypoint();
  };

  waypointForm.element
    .querySelector('.event__rollup-btn')
    .addEventListener('click', onCloseRollupBtnClick);

  const wayPoint = new ListWaypointView({
    listPoint: pointData,
    destinationData: destinationData,
    offerData: filteredOfferData,
  });

  const onOpenRollupBtnClick = (evt) => {
    evt.preventDefault();
    replaceWaypointToForm();
  };

  wayPoint.element
    .querySelector('.event__rollup-btn')
    .addEventListener('click', onOpenRollupBtnClick);

  function replaceWaypointToForm() {
    replace(waypointForm, wayPoint);
  }

  function replaceFormToWaypoint() {
    replace(wayPoint, waypointForm);
  }

  render(wayPoint, element);
};

/**
 * Создание динамического списка путевых точек.
 * @param {Object} params - Параметры для создания списка
 * @param {PointData[]} params.listPoints - Массив данных точек маршрута
 * @param {Object<string, DestinationData>} params.destinationsById - Назначения по ID
 * @param {Object<string, OffersByTypeData>} params.offersByType - Предложения по типу
 * @param {HTMLUListElement} params.element - Контейнер списка
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

/** Презентер списка. Отвечает за рендеринг компонента Списка. */
export default class ListPresenter {
  /**
   * @param {PresenterConfig} config - Конфигурация презентера
   */
  constructor({ container, tripModel }) {
    this.#container = container;
    this.#tripModel = tripModel;
  }

  #listView = new ListView();
  #container = null;
  #tripModel = null;

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
  }
}
