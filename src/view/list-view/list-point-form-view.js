import { createListPointFormTemplate } from './list-form-templates.js';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import { remove } from '../../framework/render.js';

import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

/** Создание формы добавления точки маршрута */

export default class ListPointFormView extends AbstractStatefulView {
  #isEditForm;
  #tripModel;
  #handleRollupClick = null;
  #handleResetClick = null;

  #inputDateFrom = null;
  #inputDateTo = null;

  constructor({
    pointData,
    isEditForm,
    tripModel,
    onRollupClick,
    onResetClick,
  }) {
    super();
    this.#isEditForm = isEditForm;
    this.#tripModel = tripModel;
    this.#handleRollupClick = onRollupClick;
    this.#handleResetClick = onResetClick;

    // При создании нового события добавляем по дефолту.
    if (!pointData) {
      const transformedOfferData = this.#tripModel.offersReadOnly[0].offers.map(
        (offer) => ({ ...offer, isSelected: false }),
      );
      const today = new Date().toISOString();

      pointData = {
        offerData: transformedOfferData,
        listPoint: {
          dateFrom: today,
          dateTo: today,
        },
      };
    }

    this._setState(pointData);
    this.#addEventListeners();
    this.#initInputDate();
  }

  get template() {
    return createListPointFormTemplate({
      pointData: this._state,
      isEditForm: this.#isEditForm,
      tripModel: this.#tripModel,
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
    this.#inputDateFrom = ListPointFormView.#createFlatpickr(
      this.element.querySelector('#event-start-time-1'),
      this._state.listPoint.dateFrom,
      { maxDate: this._state.listPoint.dateTo },
    );

    this.#inputDateTo = ListPointFormView.#createFlatpickr(
      this.element.querySelector('#event-end-time-1'),
      this._state.listPoint.dateTo,
      { minDate: this._state.listPoint.dateFrom },
    );

    // После создания ставим обработчики на input.
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
    const typeOffers = this.#tripModel.offersReadOnly.find(
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

    const newDestinationCityData = this.#tripModel.destinationsReadOnly.find(
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

  static #createFlatpickr(element, defaultDate, dateLimit) {
    // Для устранения ошибки линтера из-за snake case библиотеки.
    const time24hr = 'time_24hr';

    return flatpickr(element, {
      defaultDate: defaultDate,
      enableTime: true,
      dateFormat: 'Y-m-d H:i',
      [time24hr]: true, // 24-часовой формат (16:00 вместо 4:00 PM)
      formatDate: (date) => dayjs(date).format('DD/MM/YY HH:mm'),
      ...dateLimit,
    });
  }

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
}
