import { createListPointFormTemplate } from './list-form-templates.js';
import AbstractView from '../../framework/view/abstract-view.js';

/** Создание формы добавления точки маршрута */
export default class ListPointFormView extends AbstractView {
  #pointData;
  #isEditForm;
  #model;

  constructor({ pointData, isEditForm, model }) {
    super();
    this.#pointData = pointData;
    this.#isEditForm = isEditForm;
    this.#model = model;
  }

  get resetBtn() {
    return this.element.querySelector('.event__reset-btn');
  }

  get rollupBtn() {
    return this.element.querySelector('.event__rollup-btn');
  }

  get template() {
    return createListPointFormTemplate({
      pointData: this.#pointData,
      isEditForm: this.#isEditForm,
      model: this.#model,
    });
  }
}
