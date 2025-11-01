import FilterFormView from '../view/filter-view/filter-form-view.js';
import FilterItemView from '../view/filter-view/filter-item-view.js';
import { render, RenderPosition } from '../utils/render.js';

export default class FilterPresenter {
  filterFormComponet = new FilterFormView();

  constructor({ filterContainer, filters }) {
    this.container = filterContainer;
    this.filters = filters;
  }

  init() {
    render(this.filterFormComponet, this.container);
    for (let i = this.filters.length - 1; i >= 0; i--) {
      // Из-за RenderPosition.AFTERBEGIN необходимо начинать с конца.
      const element = this.filters[i];
      render(
        new FilterItemView(element),
        this.filterFormComponet.getElement(),
        RenderPosition.AFTERBEGIN
      );
    }
  }
}
