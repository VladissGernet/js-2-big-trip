import { FilterView } from '../view/index.js';
import { render } from '../framework/render.js';

/** Конфигурация презентера списка.
 * @typedef {Object} PresenterConfig
 * @property {HTMLElement} container - Контейнер для рендера
 * @property {FilterData} filters - Данные отрисовки филтров
 * @property {Class} filterModel - Модель фильтра с наблюдателем.
 */

/** Модель элемента фильтра для планировщика поездок.
 * @typedef {Object} FilterData
 * @property {string} name - Название фильтра ('Everything', 'Future', 'Past').
 * @property {boolean} isChecked - Статус активности фильтра (true/false).
 */

/** Презентер фильтров. Отвечает за рендеринг компонента фильтров. */
export default class FilterPresenter {
  #container = null;
  #filters = null;
  #filterModel = null;

  /** Публичный доступ к комоненту фильтра */
  filterComponent = null;

  /** @param {PresenterConfig} config */
  constructor({ container, filters, filterModel }) {
    this.#container = container;
    this.#filters = filters;
    this.#filterModel = filterModel;
  }

  init() {
    this.#renderFilterComponent();
  }

  #renderFilterComponent() {
    this.filterComponent = new FilterView(
      this.#filters,
      this.#filterChangeHandler,
    );
    render(this.filterComponent, this.#container);
  }

  #filterChangeHandler = (evt) => {
    this.#filterModel.setFilter(evt.target.value);
  };
}
