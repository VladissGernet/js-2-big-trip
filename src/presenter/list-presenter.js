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
  #container;
  #tripModel;
  // TODO
  // Переписать удаление точки из списка.
  // Добавить ограничение на одну форму на странице, чтобы при открытии новой другие закрывались. Для этого
  // в демо проекте task-presenter разобраться с работой Mode.DEFAULT и Mode.EDITING, и еще с this.#mode

  /** Публичный доступ для управления списком представления */
  listView = new ListView();

  /** @param {PresenterConfig} config - Конфигурация презентера */
  constructor({ container, tripModel }) {
    this.#container = container;
    this.#tripModel = tripModel;
  }

  init() {
    this.#renderList();
  }

  #renderList() {
    // Добавляем путевые точки до рендера.
    this.#tripModel.listPoints.forEach((point) => {
      this.#createPoint(point);
    });

    render(this.listView, this.#container);
  }

  #createPoint(point) {
    const pointPresenter = new PointPresenter({
      point,
      listElement: this.listView.element,
      tripEventsElement: this.#container,
      model: this.#tripModel,
    });
    pointPresenter.init();
  }
}
