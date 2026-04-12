import { render, replace, remove } from '../framework/render.js';
import { SortView } from '../view/index.js';
import { SORT_CONFIG, SORT_TYPES } from '../const.js';
import FilterPresenter from './filter-presenter.js';

/** Конфигурация презентера сортировки.
 * @typedef {Object} PresenterConfig
 * @property {Model} tripModel - Данные модели для рендера страницы
 * @property {Class} filterModel - Модель фильтра с наблюдателем.
 * @property {Class} pageMainPresenter - Презентер страницы Main.
 * @property {Class} newEventBtnPresenter - Презентер кнопки создания нового события.
 */

/** Презентер сортировки. Отвечает за рендеринг компонента сортирвки списка событйи. */
export default class SortPresenter {
  #tripModel = null;
  #filterModel = null;
  #pageMainPresenter = null;
  #newEventBtnPresenter = null;
  #component = null;

  /** @param {PresenterConfig} */
  constructor({
    tripModel,
    filterModel,
    pageMainPresenter,
    newEventBtnPresenter,
  }) {
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
    this.#pageMainPresenter = pageMainPresenter;
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
    render(this.#component, this.#pageMainPresenter.tripEventsView.element);
  }

  #handleChange = (evt) => {
    this.#newEventBtnPresenter.destroy();
    const filteredList = FilterPresenter.filterList(
      this.#filterModel.filter,
      this.#tripModel.listPoints,
    );
    const sortedList = filteredList.sort(
      SORT_CONFIG[SORT_TYPES[evt.target.value]],
    );
    this.#pageMainPresenter.reinitListView(sortedList);
  };

  #handleModeEvent = () => {
    const prevComponet = this.#component;
    this.#renderSort();
    replace(this.#component, prevComponet);
  };
}
