import { createListPointFormTemplate } from './list-form-templates.js';
import AbstractView from '../../framework/view/abstract-view.js';
import { remove } from '../../framework/render.js';

/** Создание формы добавления точки маршрута */
export default class ListPointFormView extends AbstractView {
  #pointData;
  #isEditForm;
  #model;
  #handleRollupClick = null;
  #handleResetClick = null;

  constructor({ pointData, isEditForm, model, onRollupClick, onResetClick }) {
    super();
    this.#pointData = pointData;
    this.#isEditForm = isEditForm;
    this.#model = model;
    this.#handleRollupClick = onRollupClick;
    this.#handleResetClick = onResetClick;

    this.#addEventListeners();
  }

  get template() {
    return createListPointFormTemplate({
      pointData: this.#pointData,
      isEditForm: this.#isEditForm,
      model: this.#model,
    });
  }

  removeElement() {
    super.removeElement();

    this.#removeEventListeners();
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #resetClickHandler = (evt) => {
    evt.preventDefault();
    remove(this);
    this.#handleResetClick();
  };

  #addEventListeners() {
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#resetClickHandler);

    if (this.#handleRollupClick) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#rollupClickHandler);
    }
  }

  #removeEventListeners() {
    if (this.#handleRollupClick) {
      this.element
        .querySelector('.event__rollup-btn')
        .removeEventListener('click', this.#rollupClickHandler);
    }

    this.element
      .querySelector('.event__reset-btn')
      .removeEventListener('click', this.#resetClickHandler);
  }
}
