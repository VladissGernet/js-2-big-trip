import { createListPointFormTemplate } from './list-form-templates.js';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import {
  InputDateStage,
  DateStateStage,
  DEFAULT_MINUTES_ADDITION,
  DELETE_BUTTON_STATUS,
  SAVE_BUTTON_STATUS,
  FlatpickrId,
} from '../../const.js';
import {
  transformOfferTypeData,
  findDestinationByName,
  setValidity,
  removeValidity,
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

  #handlePriceChange = (evt) => {
    const value = Number(evt.target.value.replace(/[\D]/g, ''));
    evt.target.value = value;
    evt.target.setCustomValidity('');
    // Обновляем состояние
    const newListPointState = structuredClone(this._state.listPoint);
    newListPointState.basePrice = value;
    if (value > 0) {
      this._setState({
        listPoint: {
          ...newListPointState,
          basePrice: value,
        },
      });
      return;
    }

    delete newListPointState.basePrice;
    this._setState({
      listPoint: newListPointState,
    });
  };

  /** Инициализирует выбор дат "from" и "to" библиотекой flatpickr. */
  #initInputDate() {
    const initialDateFrom = this._state.listPoint.dateFrom || null;
    const initialDateTo = this._state.listPoint.dateTo || null;

    this.#inputDateFrom = ListPointFormView.#createFlatpickr(
      this.element.querySelector('#event-start-time'),
      initialDateFrom,
      { maxDate: initialDateTo },
    );

    // Для валидации добавляем разницу в минуту.
    let minDateTo = null;
    if (initialDateFrom) {
      minDateTo = new Date(initialDateFrom);
      minDateTo.setMinutes(minDateTo.getMinutes() + DEFAULT_MINUTES_ADDITION);
    }

    this.#inputDateTo = ListPointFormView.#createFlatpickr(
      this.element.querySelector('#event-end-time'),
      initialDateTo,
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
    const form = evt.target;

    const startTimeInput = form.querySelector('#event-start-time');
    const endTimeInput = form.querySelector('#event-end-time');
    const priceInput = form.querySelector('#event-price');

    // Валидация дат.
    // Временно убираем readonly для валидации
    setValidity(startTimeInput);
    setValidity(endTimeInput);

    // Запускаем валидацию для дат.
    let isFormValid = form.reportValidity();

    removeValidity(startTimeInput);
    removeValidity(endTimeInput);

    if (!isFormValid) {
      return;
    }

    // Валидация цены: больше нуля
    if (Number(priceInput.value) <= 0) {
      priceInput.setCustomValidity('The price must be more than zero.');
    }
    // Запускаем валидацию для Цены.
    isFormValid = form.reportValidity();

    if (isFormValid) {
      this.#handleSubmitForm(evt);
    }
  };

  #changeTypeHandler = (evt) => {
    const typeOffers = this.#tripModel.offersByType.get(evt.target.value);
    this.updateElement({
      listPoint: { ...this._state.listPoint, type: evt.target.value },
      offerData: transformOfferTypeData({ allOffers: typeOffers }),
    });
  };

  #changeDestinationHandler = (evt) => {
    // TODO, при смени города теряется все текущие offers
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
        const id = FlatpickrId[element.id];
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
    const isMinDateStage = dateStage === InputDateStage.MINDATE;
    return (selectedDates) => {
      if (!selectedDates.length) {
        // Если очистили поле ввода даты, то очищаем ограничения.
        otherInput.set(
          isMinDateStage ? InputDateStage.MINDATE : InputDateStage.MAXDATE,
          null,
        );
        return;
      }

      const currentISODate = selectedDates[0].toISOString();

      // Вычисляем другую дату (плюс / минус 1 минута)
      const otherDate = new Date(currentISODate);

      otherDate.setMinutes(
        otherDate.getMinutes() +
          (isMinDateStage
            ? DEFAULT_MINUTES_ADDITION
            : -DEFAULT_MINUTES_ADDITION),
      );

      const otherISODate = otherDate.toISOString();

      // Устанавливаем minDate/maxDate в flatpickr
      otherInput.set(
        isMinDateStage ? InputDateStage.MINDATE : InputDateStage.MAXDATE,
        otherISODate,
      );

      // Обновляем состояние
      const newListPointState = {
        ...context._state.listPoint,
        [DateStateStage[dateStage]]: currentISODate,
      };

      context._setState({
        listPoint: newListPointState,
      });
    };
  }
}
