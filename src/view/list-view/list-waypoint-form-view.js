import { createListWaypointFormTemplate } from './list-form-templates.js';
import AbstractView from '../../framework/view/abstract-view.js';

/** Создание формы добавления точки маршрута */
export default class ListWaypointFormView extends AbstractView {
  /**
   * @param {WaypointFormConfig} config - Данные для экземпляра
   */
  constructor({ listPoint, destinationData, listOffers }) {
    super();
    this.#listPoint = listPoint;
    this.#destinationData = destinationData;
    this.#listOffers = listOffers;
  }

  #listPoint = null;
  #destinationData = null;
  #listOffers = null;

  get template() {
    return createListWaypointFormTemplate({
      listPoint: this.#listPoint,
      destinationData: this.#destinationData,
      listOffers: this.#listOffers,
    });
  }
}
