import { ListView } from '../view/index.js';
import { render } from '../framework/render.js';
import PointPresenter from './point-presenter.js';

/** Конфигурация презентера списка.
 * @typedef {Object} PresenterConfig
 * @property {HTMLElement} container - Контейнер для рендера
 * @property {TripModel} tripModel - Модель данных поездки
 */

/** Презентер списка. Отвечает за рендеринг компонента Списка. */
export default class ListPresenter {
  #newEventBtnPresenter;
  #container;
  #tripModel;

  #pointPresenters = new Map();

  /** Публичный доступ для управления списком представления из header презентера при создании новой точки. */
  listView = new ListView();

  /** @param {PresenterConfig} config - Конфигурация презентера */
  constructor({ container, tripModel, newEventBtnPresenter }) {
    this.#container = container;
    this.#tripModel = tripModel;
    this.#newEventBtnPresenter = newEventBtnPresenter;
  }

  init() {
    this.#renderList();
  }

  /** Полная очистка списка и коллекции презентеров. */
  clearList() {
    this.listView.element.innerHTML = '';
    this.#pointPresenters.forEach((presenter) => presenter.clear());
    this.#pointPresenters.clear();
  }

  // Перерисовывает список
  resetListView = () => {
    this.#pointPresenters.forEach((presenter) =>
      presenter.fullReplaceFormToPoint(),
    );
  };

  // Удаляет из списка
  removeFromPointPresenters = (id) => this.#pointPresenters.delete(id);

  #renderList() {
    // Добавляем путевые точки до рендера.
    this.#tripModel.listPoints.forEach((point) => this.#createPoint(point));

    render(this.listView, this.#container);
  }

  #createPoint(point) {
    const pointPresenter = new PointPresenter({
      point,
      listElement: this.listView.element,
      tripEventsElement: this.#container,
      model: this.#tripModel,
      newEventBtnPresenter: this.#newEventBtnPresenter,
      resetListView: this.resetListView,
      removeFromPointPresenters: this.removeFromPointPresenters,
    });
    pointPresenter.init();
    this.#pointPresenters.set(point.id, pointPresenter);
  }
}
