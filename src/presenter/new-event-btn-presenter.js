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
  #newWaypointForm;

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

  #onBtnClick = (evt) => {
    evt.preventDefault();
    this.#newWaypointForm = new ListPointFormView({
      isEditForm: false,
      model: this.#model,
      onResetClick: this.#handleResetBtn,
    });

    this.#btnElement.disabled = true;

    if (this.#model.listPoints.length === 0) {
      remove(this.#tripEventsEmpty);
      this.#newList = new ListView();
      render(this.#newList, this.#tripEvents.element);
      render(this.#newWaypointForm, this.#newList.element);
    } else {
      render(
        this.#newWaypointForm,
        this.#listView.element,
        RenderPosition.AFTERBEGIN,
      );
    }

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #closeForm() {
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    remove(this.#newWaypointForm);
    this.#btnElement.disabled = false;
    if (this.#model.listPoints.length === 0) {
      this.#renderEmptyMessage();
    }
  }

  #renderEmptyMessage() {
    const selectedFilter = this.#filterControls.querySelector(
      'input[name="trip-filter"]:checked',
    ).value;
    this.#tripEventsEmpty = new TripEventsEmptyView(selectedFilter);
    render(this.#tripEventsEmpty, this.#tripEvents.element);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#closeForm();
    }
  };

  #handleResetBtn = () => {
    this.#closeForm();
  };
}
