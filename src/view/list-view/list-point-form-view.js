import { createListPointFormTemplate } from './list-form-templates.js';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import { remove } from '../../framework/render.js';

/** Создание формы добавления точки маршрута */
// TODO Заменить на stateful

/*
  Теперь нужно реализовать перерисовку формы редактирования после взаимодействия с пользователем:

  при выборе пункта назначения нужно показать новые описание и фотографии.

  Обратите внимание, что при смене дополнительных опций ранее выбранные пользователем значения не сохраняются, а ещё
  выбор дополнительных опций не влияет на стоимость, указанную в соответствующем поле ввода.

  При перерисовке компонента все обработчики событий будут утеряны, поэтому их нужно будет навесить заново.

  Обратите внимание, что если вы не используете один и тот же компонент в качестве формы добавления и формы редактирования,
  вам нужно повторить поведение контролов и валидации для компонента формы добавления новой точки маршрута.

  ========================================================================================================================

  В этом задании мы выжмем всё из библиотек по работе с датами.

  Посчитайте и отобразите с помощью dayjs в заданном техзаданием формате даты в компонентах:

  дату начала события каждой точки;
  продолжительность каждой точки (должна высчитываться по разнице дат начала и конца).
  Установите из npm и подключите библиотеку flatpickr.

  Импортируйте в компонент с формой редактирования стили для flatpickr из node_modules.

  Настройте библиотеку flatpickr так, чтобы выбор даты в форме редактирования осуществлялся с её помощью. Формат
  даты указан в техническом задании.
*/
export default class ListPointFormView extends AbstractStatefulView {
  #isEditForm;
  #model;
  #handleRollupClick = null;
  #handleResetClick = null;

  constructor({ pointData, isEditForm, model, onRollupClick, onResetClick }) {
    super();
    this._setState(pointData);

    this.#isEditForm = isEditForm;
    this.#model = model;
    this.#handleRollupClick = onRollupClick;
    this.#handleResetClick = onResetClick;

    this.#addEventListeners();
  }

  get template() {
    return createListPointFormTemplate({
      pointData: this._state,
      isEditForm: this.#isEditForm,
      model: this.#model,
    });
  }

  removeElement() {
    super.removeElement();

    this.#removeEventListeners();
  }

  _restoreHandlers() {
    this.#removeEventListeners();
    this.#addEventListeners();
  }

  #addEventListeners() {
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#resetClickHandler);

    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#changeTypeHandler);

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('input', this.#changeCityHandler);

    if (this.#handleRollupClick) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#rollupClickHandler);
    }
  }

  #removeEventListeners() {
    this.element
      .querySelector('.event__reset-btn')
      .removeEventListener('click', this.#resetClickHandler);

    this.element
      .querySelector('.event__type-group')
      .removeEventListener('change', this.#changeTypeHandler);

    this.element
      .querySelector('.event__input--destination')
      .removeEventListener('click', this.#changeCityHandler);

    if (this.#handleRollupClick) {
      this.element
        .querySelector('.event__rollup-btn')
        .removeEventListener('click', this.#rollupClickHandler);
    }
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

  #changeTypeHandler = (evt) => {
    const typeOffers = this.#model.offersReadOnly.find(
      ({ type }) => type === evt.target.value,
    ).offers;

    this.updateElement({
      listPoint: { ...this._state.listPoint, type: evt.target.value },
      offerData: typeOffers,
    });
  };

  #changeCityHandler = (evt) => {
    // TODO
    // Остановился здесь
    console.log(evt.target.value);

    console.log('change');
  };
}
