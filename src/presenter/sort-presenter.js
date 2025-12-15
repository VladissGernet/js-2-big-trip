import { render } from '../framework/render.js';
import SortFormView from '../view/sort-view/sort-form-view.js';

export default class SortPresenter {
  constructor({ sortContainer, sorts }) {
    this.container = sortContainer;
    this.sorts = sorts;
  }

  init() {
    this.sortFormComponent = new SortFormView(this.sorts);
    render(this.sortFormComponent, this.container);
  }
}
