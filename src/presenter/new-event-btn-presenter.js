import {
  ListPointFormView,
  ListView,
  TripEventsEmptyView,
} from '../view/index.js';
import { render, RenderPosition } from '../framework/render.js';

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
    tripEventsEmpty: tripEventsEmpty = null,
    listView: listView = null,
    filterControls: filterControls,
    tripEvents: tripEvents,
  }) {
    this.#btnElement = btnElement;
    this.#model = model;
    this.#tripEventsEmpty = tripEventsEmpty;
    this.#listView = listView;
    this.#filterControls = filterControls;
    this.#tripEvents = tripEvents;
  }

  init() {
    this.#btnElement.addEventListener('click', (evt) => {
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
        newWaypointForm.element.remove();
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
        this.#tripEventsEmpty.element.remove();
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
    });
  }
}
