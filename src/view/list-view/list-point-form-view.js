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

  #handlePriceChange(evt) {
    // todo, replace не отрабатывает и можно написать 00001.
    const value = evt.target.value.replace(/[\D]/g, '');
    evt.target.value = value;
  }

  /** Инициализирует выбор дат "from" и "to" библиотекой flatpickr. */
  #initInputDate() {
    // TODO, при нажатии backspace выходит ошибка.
    // Также вторая дата должна иметь плюс одна минута.
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
    // TODO, добавить разницу в одну минуту

    const startTimeInput = form.querySelector('#event-start-time');
    const endTimeInput = form.querySelector('#event-end-time');

    // Временно убираем readonly для валидации
    setValidity(startTimeInput);
    setValidity(endTimeInput);

    // Запускаем валидацию
    const isValid = form.reportValidity();

    removeValidity(startTimeInput);
    removeValidity(endTimeInput);

    if (isValid) {
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
    // TODO, при смени города теряется все текущее заполнение
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
  /*
      // TODO
      // Остановился здесь, если другой инпут пустой , то ставим ему mindate\maxdate - 1 минута/+1 минута

  static #createInputDateChangeHandler(context, dateStage, otherInput) {
    return (selectedDates) => {
      const currentDate = selectedDates[0];
      const isOtherInputEmpty = !otherInput.element.value;
      if (isOtherInputEmpty) {
        if (dateStage === InputDateStage.MINDATE) {
          console.log('min');
        }
        if (dateStage === InputDateStage.MAXDATE) {
          console.log('MAXDATE');
        }
      } else {
        otherInput.set(dateStage, currentDate.toISOString());
      }


      // console.log(DEFAULT_MINUTES_ADDITION);

      // minDateTo.setMinutes(minDateTo.getMinutes() + DEFAULT_MINUTES_ADDITION);

      // console.log(selectedDates[0].getMinutes());

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
  } */

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

// import { createListPointFormTemplate } from './list-form-templates.js';
// import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
// import {
//   InputDateStage,
//   DateStateStage,
//   DEFAULT_MINUTES_ADDITION,
//   DELETE_BUTTON_STATUS,
//   SAVE_BUTTON_STATUS,
//   FlatpickerId,
// } from '../../const.js';
// import {
//   transformOfferTypeData,
//   findDestinationByName,
//   setValidity,
//   removeValidity,
// } from '../../utils/index.js';

// // Библиотека dayjs.
// import dayjs from 'dayjs';
// import flatpickr from 'flatpickr';
// import 'flatpickr/dist/flatpickr.min.css';

// /** Создание формы добавления точки маршрута */
// export default class ListPointFormView extends AbstractStatefulView {
//   #isEditForm = null;
//   #tripModel = null;

//   #handleRolldownClick = null;
//   #handleResetClick = null;
//   #handleSubmitForm = null;

//   #inputDateFrom = null;
//   #inputDateTo = null;

//   constructor({
//     viewPointData,
//     isEditForm,
//     tripModel,
//     onRolldownClick,
//     onResetClick,
//     onFormSubmit,
//   }) {
//     super();
//     this.#isEditForm = isEditForm;
//     this.#tripModel = tripModel;
//     this.#handleRolldownClick = onRolldownClick;
//     this.#handleResetClick = onResetClick;
//     this.#handleSubmitForm = onFormSubmit;

//     // Для удобства передачи данных точек упаковываю всё в this._state.
//     this._setState(viewPointData);
//     this.#addEventListeners();
//     this.#initInputDate();
//   }

//   get template() {
//     return createListPointFormTemplate({
//       viewPointData: this._state,
//       isEditForm: this.#isEditForm,
//       tripModel: this.#tripModel,
//     });
//   }

//   _restoreHandlers() {
//     this.#destroyInputDate();
//     this.#initInputDate();

//     this.#removeEventListeners();
//     this.#addEventListeners();
//   }

//   removeElement() {
//     super.removeElement();
//     this.#removeEventListeners();
//     this.#destroyInputDate();
//   }

//   disableDeleteBtn() {
//     const btn = this.element.querySelector('.event__reset-btn');
//     btn.disabled = true;
//     btn.textContent = DELETE_BUTTON_STATUS.DELETING;
//   }

//   enableDeleteBtn() {
//     const btn = this.element.querySelector('.event__reset-btn');
//     btn.disabled = false;
//     btn.textContent = DELETE_BUTTON_STATUS.DELETE;
//   }

//   disableSaveBtn() {
//     const btn = this.element.querySelector('.event__save-btn');
//     btn.disabled = true;
//     btn.textContent = SAVE_BUTTON_STATUS.SAVING;
//   }

//   enableSaveBtn() {
//     const btn = this.element.querySelector('.event__save-btn');
//     btn.disabled = false;
//     btn.textContent = SAVE_BUTTON_STATUS.SAVE;
//   }

//   #addEventListeners() {
//     this.element
//       .querySelector('.event__reset-btn')
//       .addEventListener('click', this.#resetClickHandler);

//     this.element
//       .querySelector('.event__type-group')
//       .addEventListener('change', this.#changeTypeHandler);

//     this.element
//       .querySelector('.event__input--destination')
//       .addEventListener('change', this.#changeDestinationHandler);

//     this.element
//       .querySelector('.event.event--edit')
//       .addEventListener('submit', this.#submitFormHandler);

//     this.element
//       .querySelector('.event__input.event__input--price')
//       .addEventListener('input', this.#handlePriceChange);

//     if (this.#handleRolldownClick) {
//       this.element
//         .querySelector('.event__rollup-btn')
//         .addEventListener('click', this.#rolldownClickHandler);
//     }
//   }

//   #removeEventListeners() {
//     this.element
//       .querySelector('.event__reset-btn')
//       .removeEventListener('click', this.#resetClickHandler);

//     this.element
//       .querySelector('.event__type-group')
//       .removeEventListener('change', this.#changeTypeHandler);

//     this.element
//       .querySelector('.event__input--destination')
//       .removeEventListener('change', this.#changeDestinationHandler);

//     this.element
//       .querySelector('.event.event--edit')
//       .removeEventListener('submit', this.#submitFormHandler);

//     this.element
//       .querySelector('.event__input.event__input--price')
//       .removeEventListener('input', this.#handlePriceChange);

//     if (this.#handleRolldownClick) {
//       this.element
//         .querySelector('.event__rollup-btn')
//         .removeEventListener('click', this.#rolldownClickHandler);
//     }
//   }

//   #handlePriceChange(evt) {
//     // todo, replace не отрабатывает и можно написать 00001.
//     const value = evt.target.value.replace(/[\D]/g, '');
//     evt.target.value = value;
//   }

//   /** Инициализирует выбор дат "from" и "to" библиотекой flatpickr. */
//   #initInputDate() {
//     // TODO, при нажатии backspace выходит ошибка.
//     // Также вторая дата должна иметь плюс одна минута.
//     const initialDateFrom = this._state.listPoint.dateFrom || null;
//     const initialDateTo = this._state.listPoint.dateTo || null;

//     this.#inputDateFrom = ListPointFormView.#createFlatpickr(
//       this.element.querySelector('#event-start-time'),
//       initialDateFrom,
//       { maxDate: initialDateTo },
//     );

//     // Для валидации добавляем разницу в минуту.
//     let minDateTo = null;
//     if (initialDateFrom) {
//       minDateTo = new Date(initialDateFrom);
//       minDateTo.setMinutes(minDateTo.getMinutes() + DEFAULT_MINUTES_ADDITION);
//     }

//     this.#inputDateTo = ListPointFormView.#createFlatpickr(
//       this.element.querySelector('#event-end-time'),
//       initialDateTo,
//       { minDate: minDateTo },
//     );

//     // После создания ставим обработчики на input.
//     this.#inputDateFrom.set(
//       'onChange',
//       ListPointFormView.#createInputDateChangeHandler(
//         this,
//         InputDateStage.MINDATE,
//         this.#inputDateTo,
//       ),
//     );
//     this.#inputDateTo.set(
//       'onChange',
//       ListPointFormView.#createInputDateChangeHandler(
//         this,
//         InputDateStage.MAXDATE,
//         this.#inputDateFrom,
//       ),
//     );
//   }

//   #destroyInputDate() {
//     this.#inputDateFrom.destroy();
//     this.#inputDateTo.destroy();
//   }

//   #rolldownClickHandler = (evt) => {
//     evt.preventDefault();
//     this.#handleRolldownClick();
//   };

//   #resetClickHandler = (evt) => {
//     evt.preventDefault();
//     this.#handleResetClick();
//   };

//   #submitFormHandler = (evt) => {
//     evt.preventDefault();
//     const form = evt.target;
//     // TODO, добавить разницу в одну минуту

//     const startTimeInput = form.querySelector('#event-start-time');
//     const endTimeInput = form.querySelector('#event-end-time');

//     // Временно убираем readonly для валидации
//     setValidity(startTimeInput);
//     setValidity(endTimeInput);

//     // Запускаем валидацию
//     const isValid = form.reportValidity();

//     removeValidity(startTimeInput);
//     removeValidity(endTimeInput);

//     if (isValid) {
//       this.#handleSubmitForm(evt);
//     }
//   };

//   #changeTypeHandler = (evt) => {
//     const typeOffers = this.#tripModel.offersByType.get(evt.target.value);
//     this.updateElement({
//       listPoint: { ...this._state.listPoint, type: evt.target.value },
//       offerData: transformOfferTypeData({ allOffers: typeOffers }),
//     });
//   };

//   #changeDestinationHandler = (evt) => {
//     // TODO, при смени города теряется все текущее заполнение
//     let prevDestinationCity = this._state.destinationData?.name;
//     if (!prevDestinationCity) {
//       prevDestinationCity = '';
//     }

//     const newDestinationCityData = findDestinationByName(
//       evt.target.value,
//       this.#tripModel.destinationsById,
//     );

//     if (!newDestinationCityData) {
//       evt.target.value = prevDestinationCity;
//       return;
//     }

//     // Обновляем данные.
//     this.updateElement({
//       destinationData: newDestinationCityData,
//     });
//   };

//   static #createFlatpickr(element, defaultDate, dateLimit) {
//     const time24hr = 'time_24hr';

//     return flatpickr(element, {
//       defaultDate: defaultDate,
//       enableTime: true,
//       dateFormat: 'Y-m-d H:i',
//       [time24hr]: true, // 24-часовой формат (16:00 вместо 4:00 PM)
//       formatDate: (date) => dayjs(date).format('DD/MM/YY HH:mm'),
//       ...dateLimit,
//       // Для исправления отсутствия id на элементах ввода от flatpickr.
//       // Chrome DevTools Lighthouse оставляет предупреждения.
//       onReady(_, __, instance) {
//         const monthSelect = instance.calendarContainer.querySelector(
//           '.flatpickr-monthDropdown-months',
//         );
//         const id = FlatpickerId[element.id];

//         monthSelect.id = `flatpickr-month-${id}`;

//         const yearInput =
//           instance.calendarContainer.querySelector('.numInput.cur-year');
//         yearInput.id = `flatpickr-year-${id}`;

//         const hourInput = instance.calendarContainer.querySelector(
//           '.numInput.flatpickr-hour',
//         );
//         hourInput.id = `flatpickr-hour-${id}`;

//         const minuteInput = instance.calendarContainer.querySelector(
//           '.numInput.flatpickr-minute',
//         );
//         minuteInput.id = `flatpickr-minute-${id}`;
//       },
//     });
//   }

//   // TODO
//   // Остановился здесь, если другой инпут пустой , то ставим ему mindate\maxdate - 1 минута/+1 минута

//   static #createInputDateChangeHandler(context, dateStage, otherInput) {
//     return (selectedDates) => {
//       const isOtherInputEmpty = !otherInput.element.value;

//       if (isOtherInputEmpty) {
//         if (dateStage === InputDateStage.MINDATE) {
//           const minDate = selectedDates[0];
//           const maxDate = selectedDates[0];
//           const otherDate = currentDate.setMinutes(
//             currentDate.getMinutes() + DEFAULT_MINUTES_ADDITION,
//           );
//           console.log(otherDate);

//           otherInput.set(dateStage, otherDate.toISOString());
//           // Обновление данных точки.
//           const newListPointState = {
//             ...context._state.listPoint,
//             [DateStateStage[InputDateStage.MINDATE]]: currentDate.toISOString(),
//             [DateStateStage[InputDateStage.MAXDATE]]: otherDate.toISOString(),
//           };
//           context._setState({
//             listPoint: newListPointState,
//           });
//         }
//         if (dateStage === InputDateStage.MAXDATE) {
//           currentDate.setMinutes(
//             currentDate.getMinutes() - DEFAULT_MINUTES_ADDITION,
//           );
//           otherInput.set(dateStage, currentDate.toISOString());
//         }
//       } else {
//         otherInput.set(dateStage, currentDate.toISOString());
//       }

//       // Взаимодействие с противостоящим вводом даты для синхронизации данных.
//       // otherInput.set(dateStage, ISODate);
//     };
//   }
//   /*  static #createInputDateChangeHandler(context, dateStage, otherInput) {
//     return (selectedDates) => {
//       const ISODate = selectedDates[0].toISOString();

//       // Взаимодействие с противостоящим вводом даты для синхронизации данных.
//       otherInput.set(dateStage, ISODate);

//       // Обновление данных точки.
//       const newListPointState = {
//         ...context._state.listPoint,
//         [DateStateStage[dateStage]]: ISODate,
//       };
//       context._setState({
//         listPoint: newListPointState,
//       });
//     };
//   } */
// }
