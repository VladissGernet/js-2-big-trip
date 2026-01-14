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

  /** Публичный доступ для управления списком */
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
      this.#createPoint({
        point: point,
        listElement: this.listView.element,
        model: this.#tripModel,
      });
    });

    render(this.listView, this.#container);
  }

  #createPoint({ point, model, listElement }) {
    new PointPresenter({ point, model, listElement }).init();
  }
}
