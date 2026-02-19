import { render } from '../framework/render.js';
import { SortView } from '../view/index.js';

/** Конфигурация презентера Сортировки.
 * @typedef {Object} PresenterConfig
 * @property {HTMLElement} container - Контейнер для рендера
 * @property {SortsData} sorts - Данные отрисовки сортировки
 */

/** Модель элемента сортировки для планировщика поездок.
 * @typedef {Object} SortsData
 * @property {string} name - Название сортировки ('Day', 'Event', 'Time').
 * @property {boolean} isChecked - Статус выбора сортировки (true/false).
 * @property {boolean} isDisabled - Статус активности сортировки (true/false).
 */

/** Презентер сортировки. Отвечает за рендеринг компонента сортирвки списка событйи. */
export default class SortPresenter {
  #container;
  #sorts;

  // TODO
  // Выполнить задание по сортировки

  /** @param {PresenterConfig} */
  constructor({ container, sorts }) {
    this.#container = container;
    this.#sorts = sorts;
  }

  init() {
    this.#renderSort();
  }

  #renderSort() {
    render(new SortView(this.#sorts), this.#container);
  }
}
