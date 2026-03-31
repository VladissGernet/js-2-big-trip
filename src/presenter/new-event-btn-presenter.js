import {
  ListPointFormView,
  ListView,
  TripEventsEmptyView,
  BtnView,
} from '../view/index.js';
import { render, RenderPosition, remove } from '../framework/render.js';

/** Конфиг презентера обработчика событйи на кнопку создания новго события.
 * @typedef {Object} PresenterConfig - Параметры для создания обработчика
 * @property {Object} tripModel - Модель данных поездки
 * @property {HTMLFormElement} filterControls - Элеменет контролов фильтра.
 * @property {HTMLDivElement} containerElement - Элемент для рендера кнопки.
 * @property {Object} tripEventsEmpty - Компонент сообщения об отсутсвии путевых точек.
 * @property {Object} listView - Компонент списка путевых точек.
 * @property {HTMLElement} tripEvents - Компонент секции главной страницы.
 */
export default class NewEventBtnPresenter {
  #containerElement = null;
  #tripEvents = null;
  #tripEventsEmpty = null;
  #listPresenter = null;
  #filterControls = null;
  #tripModel = null;
  #newList = null;
  #newWaypointForm = null;
  #newEventBtn = null;

  /** @param {PresenterConfig} config - Конфигурация презентера */
  constructor({
    tripModel,
    filterControls,
    containerElement,
    tripEventsEmpty = null,
    listPresenter = null,
    tripEvents = null,
  }) {
    this.#tripModel = tripModel;
    this.#filterControls = filterControls;
    this.#containerElement = containerElement;
    this.#tripEventsEmpty = tripEventsEmpty;
    this.#listPresenter = listPresenter;
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
  connectPageMainComponents({ tripEventsEmpty, listPresenter, tripEvents }) {
    this.#tripEventsEmpty = tripEventsEmpty;
    this.#listPresenter = listPresenter;
    this.#tripEvents = tripEvents;
  }

  closeForm() {
    if (!this.#newWaypointForm) {
      return;
    }

    document.removeEventListener('keydown', this.#escKeyDownHandler);
    remove(this.#newWaypointForm);
    this.#newWaypointForm = null;
    this.#newEventBtn.element.disabled = false;
    if (this.#tripModel.listPoints.length === 0) {
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

  #handleBtnClick = () => {
    if (this.#listPresenter) {
      this.#listPresenter.resetListView();
    }

    this.#newWaypointForm = new ListPointFormView({
      isEditForm: false,
      tripModel: this.#tripModel,
      onResetClick: this.#handleResetBtn,
    });

    this.#newEventBtn.element.disabled = true;

    if (this.#tripModel.listPoints.length === 0) {
      // Очищаю таблицу.
      remove(this.#tripEventsEmpty);
      this.#tripEvents.element.innerHTML =
        '<h2 class="visually-hidden">Trip events</h2>';

      // Создаю новый список.
      this.#newList = new ListView();
      render(this.#newList, this.#tripEvents.element);
      render(this.#newWaypointForm, this.#newList.element);
    } else {
      render(
        this.#newWaypointForm,
        this.#listPresenter.listView.element,
        RenderPosition.AFTERBEGIN,
      );
    }

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.closeForm();
    }
  };

  #handleResetBtn = () => {
    this.closeForm();
  };
}
