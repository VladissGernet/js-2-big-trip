import { createListPointFormTemplate } from './list-form-templates.js';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import {
  InputDateStage,
  DateStateStage,
  DEFAULT_MINUTES_ADDITION,
  DELETE_BUTTON_STATUS,
  SAVE_BUTTON_STATUS,
  FlatpickerId,
} from '../../const.js';
import {
  transformOfferTypeData,
  findDestinationByName,
} from '../../utils/index.js';

// Библиотека dayjs.
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

  #inputDateFrom = null;
  #inputDateTo = null;

  constructor({
    viewPointData,
    isEditForm,
    tripModel,
    onRolldownClick,
    onResetClick,
    onFormSubmit,
  }) {
    super();
    this.#isEditForm = isEditForm;
    this.#tripModel = tripModel;
    this.#handleRolldownClick = onRolldownClick;
    this.#handleResetClick = onResetClick;
    this.#handleSubmitForm = onFormSubmit;

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

  _restoreHandlers() {
    this.#destroyInputDate();
    this.#initInputDate();

    this.#removeEventListeners();
    this.#addEventListeners();
  }

  removeElement() {
    super.removeElement();
    this.#removeEventListeners();
    this.#destroyInputDate();
  }

  disableDeleteBtn() {
    const btn = this.element.querySelector('.event__reset-btn');
    btn.disabled = true;
    btn.textContent = DELETE_BUTTON_STATUS.DELETING;
  }

  enableDeleteBtn() {
    const btn = this.element.querySelector('.event__reset-btn');
    btn.disabled = false;
    btn.textContent = DELETE_BUTTON_STATUS.DELETE;
  }

  disableSaveBtn() {
    const btn = this.element.querySelector('.event__save-btn');
    btn.disabled = true;
    btn.textContent = SAVE_BUTTON_STATUS.SAVING;
  }

  enableSaveBtn() {
    const btn = this.element.querySelector('.event__save-btn');
    btn.disabled = false;
    btn.textContent = SAVE_BUTTON_STATUS.SAVE;
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
      .addEventListener('input', this.#handlePriceChange);

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
      .removeEventListener('input', this.#handlePriceChange);

    if (this.#handleRolldownClick) {
      this.element
        .querySelector('.event__rollup-btn')
        .removeEventListener('click', this.#rolldownClickHandler);
    }
  }

  #handlePriceChange(evt) {
    const value = evt.target.value.replace(/[\D]/g, '');
    evt.target.value = value;
  }

  /** Инициализирует выбор дат "from" и "to" библиотекой flatpickr. */
  #initInputDate() {
    this.#inputDateFrom = ListPointFormView.#createFlatpickr(
      this.element.querySelector('#event-start-time'),
      this._state.listPoint.dateFrom,
      { maxDate: this._state.listPoint.dateTo },
    );

    // Для валидации добавляем разницу в минуту.
    const minDateTo = new Date(this._state.listPoint.dateFrom);
    minDateTo.setMinutes(minDateTo.getMinutes() + DEFAULT_MINUTES_ADDITION);
    minDateTo.toISOString();

    this.#inputDateTo = ListPointFormView.#createFlatpickr(
      this.element.querySelector('#event-end-time'),
      this._state.listPoint.dateTo,
      { minDate: minDateTo },
    );

    // После создания ставим обработчики на input.
    this.#inputDateFrom.set(
      'onChange',
      ListPointFormView.#createInputDateChangeHandler(
        this,
        InputDateStage.MINDATE,
        this.#inputDateTo,
      ),
    );
    this.#inputDateTo.set(
      'onChange',
      ListPointFormView.#createInputDateChangeHandler(
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
    this.#handleResetClick();
  };

  #submitFormHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmitForm(evt);
  };

  #changeTypeHandler = (evt) => {
    const typeOffers = this.#tripModel.offersByType.get(evt.target.value);
    this.updateElement({
      listPoint: { ...this._state.listPoint, type: evt.target.value },
      offerData: transformOfferTypeData({ allOffers: typeOffers }),
    });
  };

  #changeDestinationHandler = (evt) => {
    let prevDestinationCity = this._state.destinationData?.name;
    if (!prevDestinationCity) {
      prevDestinationCity = '';
    }

    const newDestinationCityData = findDestinationByName(
      evt.target.value,
      this.#tripModel.destinationsById,
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

      // Для исправления отсутствия id на элементах ввода от flatpickr.
      // Chrome DevTools Lighthouse оставляет предупреждения.
      onReady(_, __, instance) {
        const monthSelect = instance.calendarContainer.querySelector(
          '.flatpickr-monthDropdown-months',
        );
        const id = FlatpickerId[element.id];

        monthSelect.id = `flatpickr-month-${id}`;

        const yearInput =
          instance.calendarContainer.querySelector('.numInput.cur-year');
        yearInput.id = `flatpickr-year-${id}`;

        const hourInput = instance.calendarContainer.querySelector(
          '.numInput.flatpickr-hour',
        );
        hourInput.id = `flatpickr-hour-${id}`;

        const minuteInput = instance.calendarContainer.querySelector(
          '.numInput.flatpickr-minute',
        );
        minuteInput.id = `flatpickr-minute-${id}`;
      },
    });
  }

  static #createInputDateChangeHandler(context, dateStage, otherInput) {
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
