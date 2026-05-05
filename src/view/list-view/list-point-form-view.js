import { createListPointFormTemplate } from './list-form-templates.js';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import { remove } from '../../framework/render.js';
import {
  InputDateStage,
  DateStateStage,
  DEFAULT_TYPE_OFFER,
} from '../../const.js';

import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

/** Создание формы добавления точки маршрута */
export default class ListPointFormView extends AbstractStatefulView {
  #isEditForm = null;
  #tripModel = null;

  #handleRolldownClick = null;
  #handleResetClick = null;
  #handleSubmitForm = null;
  #handlePriceChange = null;

  #inputDateFrom = null;
  #inputDateTo = null;

  constructor({
    viewPointData,
    isEditForm,
    tripModel,
    onRolldownClick,
    onResetClick,
    onFormSubmit,
    onPriceChange,
  }) {
    super();
    this.#isEditForm = isEditForm;
    this.#tripModel = tripModel;
    this.#handleRolldownClick = onRolldownClick;
    this.#handleResetClick = onResetClick;
    this.#handleSubmitForm = onFormSubmit;
    this.#handlePriceChange = onPriceChange;

    // При создании нового события добавляем по дефолту.
    if (!viewPointData) {
      const today = new Date().toISOString();

      // TODO есть подозрение, что при отправке дата будет неверной
      viewPointData = {
        offerData: this.#tripModel.offersByType.get(DEFAULT_TYPE_OFFER),
        listPoint: {
          dateFrom: today,
          dateTo: today,
        },
      };
    }

    // Для удобства передачи данных точек упаковываю всё в this._state.
    this._setState(viewPointData);
    this.#addEventListeners();
    this.#initInputDate();
  }

  get template() {
    return createListPointFormTemplate({
      viewPointData: this._state,
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
      .addEventListener('submit', this.#submitFormHandler);

    this.element
      .querySelector('.event__input.event__input--price')
      .addEventListener('change', this.#handlePriceChange);

    if (this.#handleRolldownClick) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#rolldownClickHandler);
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
      .removeEventListener('submit', this.#submitFormHandler);

    this.element
      .querySelector('.event__input.event__input--price')
      .removeEventListener('change', this.#handlePriceChange);

    if (this.#handleRolldownClick) {
      this.element
        .querySelector('.event__rollup-btn')
        .removeEventListener('click', this.#rolldownClickHandler);
    }
  }

  /** Иницилизирует выбор дат "from" и "to" библиотекой flatpickr. */
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
        InputDateStage.MINDATE,
        this.#inputDateTo,
      ),
    );
    this.#inputDateTo.set(
      'onChange',
      ListPointFormView.#createInputDateChangeHadler(
        this,
        InputDateStage.MAXDATE,
        this.#inputDateFrom,
      ),
    );
  }

  #destroyInputDate() {
    this.#inputDateFrom.destroy();
    this.#inputDateTo.destroy();
  }

  #rolldownClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRolldownClick();
  };

  #resetClickHandler = (evt) => {
    evt.preventDefault();
    remove(this);
    this.#handleResetClick();
  };

  #submitFormHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmitForm(evt);
  };

  #changeTypeHandler = (evt) => {
    const typeOffers = this.#tripModel.offersByType.get(evt.target.value);
    // TODO остановился здесь, оно прогитывает map, надо адаптировать
    console.log(typeOffers);

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

    // Обновляем данные.
    this.updateElement({
      destinationData: newDestinationCityData,
    });
  };

  static #createFlatpickr(element, defaultDate, dateLimit) {
    // Для устранения ошибки линтера из-за snake_case в библиотеке.
    const time24hr = 'time_24hr';

    return flatpickr(element, {
      defaultDate: defaultDate,
      enableTime: true,
      dateFormat: 'Y-m-d H:i',
      [time24hr]: true, // 24-часовой формат (16:00 вместо 4:00 PM)
      formatDate: (date) => dayjs(date).format('DD/MM/YY HH:mm'),
      ...dateLimit,

      // Для исправления отсутсвия id на элементах ввода от flatpickr.
      // Chrome DevTools Lighthouse оставляет предупреждения.
      onReady(_, __, instance) {
        const monthSelect = instance.calendarContainer.querySelector(
          '.flatpickr-monthDropdown-months',
        );
        monthSelect.id = `flatpickr-month-${element.id}`;

        const yearInput =
          instance.calendarContainer.querySelector('.numInput.cur-year');
        yearInput.id = `flatpickr-year-${element.id}`;

        const hourInput = instance.calendarContainer.querySelector(
          '.numInput.flatpickr-hour',
        );
        hourInput.id = `flatpickr-hour-${element.id}`;

        const minuteInput = instance.calendarContainer.querySelector(
          '.numInput.flatpickr-minute',
        );
        minuteInput.id = `flatpickr-minute-${element.id}`;
      },
    });
  }

  static #createInputDateChangeHadler(context, dateStage, otherInput) {
    return (selectedDates) => {
      const ISODate = selectedDates[0].toISOString();

      // Взаимодействие с противостоящим вводом даты для синхронизации данных.
      otherInput.set(dateStage, ISODate);

      // Обновление данных точки.
      const newListPointState = {
        ...context._state.listPoint,
        [DateStateStage[dateStage]]: ISODate,
      };
      context._setState({
        listPoint: newListPointState,
      });
    };
  }
}
