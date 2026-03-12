import { createListPointFormTemplate } from './list-form-templates.js';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import { remove } from '../../framework/render.js';

import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

/** Создание формы добавления точки маршрута */

/*
  TODO

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

  #inputDateFrom = null;
  #inputDateTo = null;

  constructor({ pointData, isEditForm, model, onRollupClick, onResetClick }) {
    super();
    this.#isEditForm = isEditForm;
    this.#model = model;
    this.#handleRollupClick = onRollupClick;
    this.#handleResetClick = onResetClick;

    // При создании нового события добавляем по дефолту.
    if (!pointData) {
      const transformedOfferData = this.#model.offersReadOnly[0].offers.map(
        (offer) => ({ ...offer, isSelected: false }),
      );
      // TODO при создании нового события исправить ошибку
      pointData = { offerData: transformedOfferData };
    }

    this._setState(pointData);
    this.#addEventListeners();
    this.#initInputDate();
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
    this.#destroyInputDate();
  }

  _restoreHandlers() {
    this.#destroyInputDate();
    this.#initInputDate();

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
      .addEventListener('change', this.#changeDestinationHandler);

    this.element
      .querySelector('.event.event--edit')
      .addEventListener('submit', this.#saveFormHandler);

    if (this._state.offerData.length) {
      this.element
        .querySelector('.event__available-offers')
        .addEventListener('change', this.#changeOfferHandler);
    }

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
      .removeEventListener('change', this.#changeDestinationHandler);

    this.element
      .querySelector('.event.event--edit')
      .removeEventListener('submit', this.#saveFormHandler);

    if (this._state.offerData.length) {
      this.element
        .querySelector('.event__available-offers')
        .addEventListener('change', this.#changeOfferHandler);
    }

    if (this.#handleRollupClick) {
      this.element
        .querySelector('.event__rollup-btn')
        .removeEventListener('click', this.#rollupClickHandler);
    }
  }

  #initInputDate() {
    this.#inputDateFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),

      ListPointFormView.#createFlatpickrEventConfig(
        this._state.listPoint.dateFrom,
        { maxDate: this._state.listPoint.dateTo },
      ),
    );

    this.#inputDateTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      ListPointFormView.#createFlatpickrEventConfig(
        this._state.listPoint.dateTo,
        { minDate: this._state.listPoint.dateFrom },
      ),
    );

    this.#inputDateFrom.set(
      'onChange',
      ListPointFormView.#createInputDateChangeHadler(
        this,
        'minDate',
        this.#inputDateTo,
      ),
    );
    this.#inputDateTo.set(
      'onChange',
      ListPointFormView.#createInputDateChangeHadler(
        this,
        'maxDate',
        this.#inputDateFrom,
      ),
    );
  }

  #destroyInputDate() {
    this.#inputDateFrom.destroy();
    this.#inputDateTo.destroy();
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

  #saveFormHandler = (evt) => {
    evt.preventDefault();
    console.log(this._state);
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

  #changeDestinationHandler = (evt) => {
    let prevDestinationCity = this._state.destinationData?.name;
    if (!prevDestinationCity) {
      prevDestinationCity = '';
    }

    const newDestinationCityData = this.#model.destinationsReadOnly.find(
      ({ name }) => name === evt.target.value,
    );

    if (!newDestinationCityData) {
      evt.target.value = prevDestinationCity;
      return;
    }

    this.updateElement({
      destinationData: newDestinationCityData,
    });
  };

  #changeOfferHandler = (evt) => {
    const updatedOfferData = this._state.offerData.map((item) => {
      if (item.title === evt.target.id) {
        item.isSelected = evt.target.checked;
      }
      return item;
    });

    this._setState({
      offerData: updatedOfferData,
    });
  };

  static #createInputDateChangeHadler(context, dateStage, otherInput) {
    return (selectedDates) => {
      const newListPoint = {
        ...context._state.listPoint,
        [dateStage]: selectedDates[0].toISOString(),
      };

      otherInput.set(dateStage, selectedDates[0].toISOString());

      context._setState({
        listPoint: newListPoint,
      });
    };
  }

  static #createFlatpickrEventConfig(defaultDate, dateLimit) {
    // Для устранения ошибки линтера из-за snake case библиотеки.
    const time24hr = 'time_24hr';

    return {
      defaultDate: defaultDate,
      enableTime: true,
      dateFormat: 'Y-m-d H:i',
      [time24hr]: true, // 24-часовой формат (16:00 вместо 4:00 PM)
      formatDate: (date) => dayjs(date).format('DD/MM/YY HH:mm'),
      ...dateLimit,
    };
  }
}
