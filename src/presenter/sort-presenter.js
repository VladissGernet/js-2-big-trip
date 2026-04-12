import { render, replace, remove } from '../framework/render.js';
import { SortView } from '../view/index.js';
import { SORT_CONFIG, SORT_TYPES } from '../const.js';
import FilterPresenter from './filter-presenter.js';

/** Конфигурация презентера сортировки.
 * @typedef {Object} PresenterConfig
 * @property {HTMLElement} tripEventsElement - Контейнер для рендера
 * @property {Model} tripModel - Данные модели для рендера страницы
 * @property {Class} filterModel - Модель фильтра с наблюдателем.
 * @property {Class} listPresenter - Презентер списка.
 * @property {Class} newEventBtnPresenter - Презентер кнопки создания нового события.
 */

/** Презентер сортировки. Отвечает за рендеринг компонента сортирвки списка событйи. */
export default class SortPresenter {
  #component = null;

  #tripEventsElement = null;
  #tripModel = null;
  #filterModel = null;
  #listPresenter = null;
  #newEventBtnPresenter = null;

  /** @param {PresenterConfig} */
  constructor({
    tripEventsElement,
    tripModel,
    filterModel,
    listPresenter,
    newEventBtnPresenter,
  }) {
    this.#tripEventsElement = tripEventsElement;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
    this.#listPresenter = listPresenter;
    this.#newEventBtnPresenter = newEventBtnPresenter;

    this.#filterModel.addObserver(this.#handleModeEvent);
  }

  init() {
    this.#renderSort();
  }

  removeComponent() {
    remove(this.#component);
  }

  #renderSort() {
    this.#component = new SortView(this.#handleChange);
    render(this.#component, this.#tripEventsElement);
  }

  #handleChange = (evt) => {
    this.#newEventBtnPresenter.destroy();

    this.#listPresenter.clearList();
    const filteredList = FilterPresenter.filterList(
      this.#filterModel.filter,
      this.#tripModel.listPoints,
    );
    const sortedList = filteredList.sort(
      SORT_CONFIG[SORT_TYPES[evt.target.value]],
    );
    this.#listPresenter.init(sortedList);
  };

  #handleModeEvent = () => {
    const prevComponet = this.#component;
    this.#renderSort();
    replace(this.#component, prevComponet);
  };
}
