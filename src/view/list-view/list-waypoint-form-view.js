import { createListWaypointFormTemplate } from './list-form-templates.js';
import AbstractView from '../../framework/view/abstract-view.js';

/**
 * @typedef {Object} ListPoint
 * @property {string} id - Уникальный идентификатор бронирования (UUID).
 * @property {number} basePrice - Базовая цена в рублях.
 * @property {string} dateFrom - Дата и время начала (ISO 8601).
 * @property {string} dateTo - Дата и время окончания (ISO 8601).
 * @property {string} destination - Идентификатор пункта назначения (UUID).
 * @property {boolean} isFavorite - Флаг избранного.
 * @property {string[]} offers - Массив идентификаторов предложений (UUID).
 * @property {string} type - Тип бронирования ('check-in').
 */

/**
 * @typedef {Object} DestinationData
 * @property {string} name - Название пункта назначения (например, "Chamonix").
 * @property {string} description - Описание места (например, "Chamonix - in a middle of Europe").
 * @property {Array<Picture>} pictures - Массив фотографий места.
 */

/**
 * @typedef {Object} Picture
 * @property {string} src - URL изображения (например, "https://24.objects.htmlacademy.pro/static/destinations/12.jpg").
 * @property {string} description - Описание изображения.
 */

/**
 * @typedef {Object} Offer
 * @property {string} title - Название предложения (например, "Add breakfast").
 * @property {number} price - Цена предложения в евро.
 */

/**
 * @typedef {Object<string, Offer>} ListOffers
 * @description Объект предложений по UUID. Ключи — идентификаторы предложений.
 */

/**
 * Создание формы добавления точки маршрута
 */
export default class ListWaypointFormView extends AbstractView {
  /**
   * @type {ListPoint} Точка маршрута
   */
  #listPoint = null;

  /**
   * @type {DestinationData} Данные о назначении
   */
  #destinationData = null;

  /**
   * @type {ListOffers} Предложения по типу
   */
  #listOffers = null;

  constructor({ listPoint, destinationData, listOffers }) {
    super();
    this.#listPoint = listPoint;
    this.#destinationData = destinationData;
    this.#listOffers = listOffers;
  }

  get template() {
    return createListWaypointFormTemplate({
      listPoint: this.#listPoint,
      destinationData: this.#destinationData,
      listOffers: this.#listOffers,
    });
  }
}
