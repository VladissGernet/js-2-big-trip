import { render, replace } from '../framework/render.js';
import { SortView } from '../view/index.js';
import { SORT_CONFIG, SORT_TYPES } from '../const.js';
import ListPresenter from './list-presenter.js';

/** Презентер сортировки. Отвечает за рендеринг компонента сортирвки списка событйи. */
export default class SortPresenter {
  #container;
  #component;
  #tripModel;
  #filterModel;
  #listPresenter;
  #newEventBtnPresenter;

  /** @param {PresenterConfig} */
  constructor({
    container,
    tripModel,
    filterModel,
    listPresenter,
    newEventBtnPresenter,
  }) {
    this.#container = container;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
    this.#listPresenter = listPresenter;
    this.#newEventBtnPresenter = newEventBtnPresenter;

    this.#filterModel.addObserver(this.#handleModeEvent);
  }

  init() {
    this.#renderSort();
  }

  #renderSort() {
    this.#component = new SortView(this.#handleChange);

    const currentSortValue = this.#component.element.querySelector(
      'input[type="radio"]:checked',
    ).value;
    this.#tripModel.listPoints.sort(SORT_CONFIG[SORT_TYPES[currentSortValue]]);

    render(this.#component, this.#container);
  }

  #handleChange = (evt) => {
    this.#newEventBtnPresenter.closeForm();

    this.#listPresenter.clearList();
    const filteredList = ListPresenter.filterList(
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
