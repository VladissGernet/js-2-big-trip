import {
  ListPointFormView,
  ListView,
  TripEventsEmptyView,
} from '../view/index.js';
import { render, RenderPosition, remove } from '../framework/render.js';

/** Конфиг презентера обработчика событйи на кнопку создания новго события.
 * @typedef {Object} PresenterConfig - Параметры для создания обработчика
 * @property {HTMLButtonElement} btnElement - Элемент кнопки на страницы.
 * @property {Object} model - Модель данных поездки
 * @property {Object} tripEventsEmpty - Компонент сообщения об отсутсвии путевых точек.
 * @property {Object} listView - Компонент списка путевых точек.
 * @property {HTMLFormElement} filterControls - Элеменет контролов фильтра.
 * @property {HTMLElement} tripEvents - Компонент секции главной страницы.
 */
export default class NewEventBtnPresenter {
  #btnElement;
  #tripEvents;
  #tripEventsEmpty;
  #listView;
  #filterControls;
  #model;
  #newList;

  /** @param {PresenterConfig} config - Конфигурация презентера */
  constructor({
    btnElement: btnElement,
    model: model,
    filterControls: filterControls,
    tripEventsEmpty: tripEventsEmpty = null,
    listView: listView = null,
    tripEvents: tripEvents = null,
  }) {
    this.#btnElement = btnElement;
    this.#model = model;
    this.#filterControls = filterControls;
    this.#tripEventsEmpty = tripEventsEmpty;
    this.#listView = listView;
    this.#tripEvents = tripEvents;
  }

  init() {
    this.#addEventListener();
  }

  connectPageMainComponents({ tripEventsEmpty, listView, tripEvents }) {
    this.#tripEventsEmpty = tripEventsEmpty;
    this.#listView = listView;
    this.#tripEvents = tripEvents;
  }

  #addEventListener() {
    this.#btnElement.addEventListener('click', this.#onBtnClick);
  }

  // TODO остановился на рефакторинге здесь
  #onBtnClick = (evt) => {
    evt.preventDefault();

    const newWaypointForm = new ListPointFormView({
      isEditForm: false,
      model: this.#model,
    });

    const resetButton =
      newWaypointForm.element.querySelector('.event__reset-btn');

    let escKeyDownHandler = null;
    let resetButtonHandler = null;

    const closeForm = () => {
      document.removeEventListener('keydown', escKeyDownHandler);
      resetButton.removeEventListener('click', resetButtonHandler);
      remove(newWaypointForm);
      this.#btnElement.disabled = false;

      if (this.#model.listPoints.length === 0) {
        const selectedFilter = this.#filterControls.querySelector(
          'input[name="trip-filter"]:checked'
        ).value;
        this.#tripEventsEmpty = new TripEventsEmptyView(selectedFilter);
        render(this.#tripEventsEmpty, this.#tripEvents.element);
      }
    };

    escKeyDownHandler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeForm();
      }
    };

    resetButtonHandler = (e) => {
      e.preventDefault();
      closeForm();
    };

    this.#btnElement.disabled = true;

    resetButton.addEventListener('click', resetButtonHandler);

    if (this.#model.listPoints.length === 0) {
      remove(this.#tripEventsEmpty);
      this.#newList = new ListView();
      render(this.#newList, this.#tripEvents.element);
      render(newWaypointForm, this.#newList.element);
    } else {
      render(
        newWaypointForm,
        this.#listView.element,
        RenderPosition.AFTERBEGIN
      );
    }

    document.addEventListener('keydown', escKeyDownHandler);
  };
}
