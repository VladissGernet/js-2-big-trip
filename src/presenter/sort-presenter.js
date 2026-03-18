import { render } from '../framework/render.js';
import { SortView } from '../view/index.js';
import { SORT_CONFIG, SORT_TYPES } from '../const.js';

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
  #component;
  #tripModel;
  #listPresenter;

  /** @param {PresenterConfig} */
  constructor({ container, sorts, tripModel, listPresenter }) {
    this.#container = container;
    this.#sorts = sorts;
    this.#tripModel = tripModel;
    this.#listPresenter = listPresenter;
  }

  init() {
    this.#renderSort();
  }

  #renderSort() {
    this.#component = new SortView({
      sorts: this.#sorts,
      onChange: this.#handleChange,
    });

    const currentSortValue = this.#component.element.querySelector(
      'input[type="radio"]:checked',
    ).value;
    this.#tripModel.listPoints.sort(SORT_CONFIG[SORT_TYPES[currentSortValue]]);

    render(this.#component, this.#container);
  }

  #handleChange = (evt) => {
    this.#listPresenter.clearList();
    this.#tripModel.listPoints.sort(SORT_CONFIG[SORT_TYPES[evt.target.value]]);
    this.#listPresenter.init();
  };
}
