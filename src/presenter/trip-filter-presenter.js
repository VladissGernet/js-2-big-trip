import FilterFormView from '../view/filter-view/filter-form-view.js';
import { render } from '../utils/render.js';

export default class FilterPresenter {
  constructor({ filterContainer, filters }) {
    this.container = filterContainer;
    this.filters = filters;
  }

  init() {
    this.filterFormComponet = new FilterFormView(this.filters);
    render(this.filterFormComponet, this.container);
  }
}
