import {
  ListPointFormView,
  ListView,
  TripEventsEmptyView,
  BtnView,
} from '../view/index.js';
import { render, RenderPosition, remove } from '../framework/render.js';

/** Конфиг презентера обработчика событйи на кнопку создания новго события.
 * @typedef {Object} PresenterConfig - Параметры для создания обработчика
 * @property {Object} model - Модель данных поездки
 * @property {HTMLFormElement} filterControls - Элеменет контролов фильтра.
 * @property {HTMLDivElement} containerElement - Элемент для рендера кнопки.
 * @property {Object} tripEventsEmpty - Компонент сообщения об отсутсвии путевых точек.
 * @property {Object} listView - Компонент списка путевых точек.
 * @property {HTMLElement} tripEvents - Компонент секции главной страницы.
 */
export default class NewEventBtnPresenter {
  #containerElement;
  #tripEvents;
  #tripEventsEmpty;
  #listView;
  #filterControls;
  #model;
  #newList;
  #newWaypointForm;
  #newEventBtn = null;

  /** @param {PresenterConfig} config - Конфигурация презентера */
  constructor({
    model,
    filterControls,
    containerElement,
    tripEventsEmpty = null,
    listView = null,
    tripEvents = null,
  }) {
    this.#model = model;
    this.#filterControls = filterControls;
    this.#containerElement = containerElement;
    this.#tripEventsEmpty = tripEventsEmpty;
    this.#listView = listView;
    this.#tripEvents = tripEvents;
  }

  init() {
    this.#newEventBtn = new BtnView({
      className: 'trip-main__event-add-btn btn btn--big btn--yellow',
      onClick: this.#handleBtnClick,
    });

    render(this.#newEventBtn, this.#containerElement);
  }

  /** Подключает компоненты из main после его редера */
  connectPageMainComponents({ tripEventsEmpty, listView, tripEvents }) {
    this.#tripEventsEmpty = tripEventsEmpty;
    this.#listView = listView;
    this.#tripEvents = tripEvents;
  }

  #handleBtnClick = () => {
    this.#newWaypointForm = new ListPointFormView({
      isEditForm: false,
      model: this.#model,
      onResetClick: this.#handleResetBtn,
    });

    this.#newEventBtn.element.disabled = true;

    if (this.#model.listPoints.length === 0) {
      remove(this.#tripEventsEmpty);
      this.#tripEventsEmpty = null;
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
    this.#newWaypointForm = null;
    this.#newEventBtn.element.disabled = false;
    if (this.#model.listPoints.length === 0) {
      this.#renderEmptyMessage();
    }
  }

  #renderEmptyMessage() {
    const selectedFilter = this.#filterControls.querySelector(
      'input[name="trip-filter"]:checked',
    ).value;
    this.#newList = null;
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
