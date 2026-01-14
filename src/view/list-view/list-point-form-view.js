import { createListPointFormTemplate } from './list-form-templates.js';
import AbstractView from '../../framework/view/abstract-view.js';

/** Создание формы добавления точки маршрута */
export default class ListPointFormView extends AbstractView {
  #listPoint;
  #destinationData;
  #listOffers;
  #isEditForm;
  #model;

  constructor({ listPoint, destinationData, listOffers, isEditForm, model }) {
    super();
    this.#listPoint = listPoint;
    this.#destinationData = destinationData;
    this.#listOffers = listOffers;
    this.#isEditForm = isEditForm;
    this.#model = model;
  }

  get resetButton() {
    return this.element.querySelector('.event__reset-btn');
  }

  get template() {
    return createListPointFormTemplate({
      listPoint: this.#listPoint,
      destinationData: this.#destinationData,
      listOffers: this.#listOffers,
      isEditForm: this.#isEditForm,
      model: this.#model,
    });
  }
}
