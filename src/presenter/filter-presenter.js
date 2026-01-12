import { FilterView } from '../view/index.js';
import { render } from '../framework/render.js';

/** Конфигурация презентера списка.
 * @typedef {Object} PresenterConfig
 * @property {HTMLElement} container - Контейнер для рендера
 * @property {FilterData} filters - Данные отрисовки филтров
 */

/** Модель элемента фильтра для планировщика поездок.
 * @typedef {Object} FilterData
 * @property {string} name - Название фильтра ('Everything', 'Future', 'Past').
 * @property {boolean} isChecked - Статус активности фильтра (true/false).
 */

/** Презентер фильтров. Отвечает за рендеринг компонента фильтров. */
export default class FilterPresenter {
  #container;
  #filters;

  /** Публичный доступ к комоненту фильтра */
  filterComponent = null;

  /** @param {PresenterConfig} config */
  constructor({ container, filters }) {
    this.#container = container;
    this.#filters = filters;
  }

  init() {
    this.#renderFilterComponent();
  }

  #renderFilterComponent() {
    this.filterComponent = new FilterView(this.#filters);
    render(this.filterComponent, this.#container);
  }
}
