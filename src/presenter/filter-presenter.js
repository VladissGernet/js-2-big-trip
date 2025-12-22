import FilterFormView from '../view/filter-view/filter-form-view.js';
import { render } from '../framework/render.js';

/**
 * Презентер фильтров. Отвечает за рендеринг компонента фильтров.
 */
export default class FilterPresenter {
  /**
   * @param {Object} config Конфигурация презентера
   * @param {HTMLDivElement} config.filterContainer Контейнер для размещения фильтров
   * @param {Array<{name: string, isChecked: boolean}>} config.filters Массив фильтров
   */
  constructor({ filterContainer, filters }) {
    this.container = filterContainer;
    this.filters = filters;
  }

  /**
   * Инициализирует презентер, создает и рендерит компонент фильтров
   */
  init() {
    this.filterFormComponent = new FilterFormView(this.filters);
    render(this.filterFormComponent, this.container);
  }
}
