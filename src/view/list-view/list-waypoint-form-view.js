import { createListWaypointFormTemplate } from './list-form-templates.js';
import AbstractView from '../../framework/view/abstract-view.js';

/** Создание формы добавления точки маршрута */
export default class ListWaypointFormView extends AbstractView {
  constructor({ listPoint, destinationData, listOffers, isEditForm }) {
    super();
    this.#listPoint = listPoint;
    this.#destinationData = destinationData;
    this.#listOffers = listOffers;
    this.#isEditForm = isEditForm;
  }

  #listPoint;
  #destinationData;
  #listOffers;
  #isEditForm;

  get template() {
    return createListWaypointFormTemplate({
      listPoint: this.#listPoint,
      destinationData: this.#destinationData,
      listOffers: this.#listOffers,
      isEditForm: this.#isEditForm,
    });
  }
}
