import ListView from '../view/list-view/list-view.js';
import ListCreationFormView from '../view/list-view/list-creation-form-view.js';

import { render } from '../utils/render.js';

export default class ListPresenter {
  constructor({ container }) {
    this.container = container;
  }

  init() {
    const list = new ListView();
    const listCreationFormView = new ListCreationFormView();
    render(list, this.container);
    render(listCreationFormView, list.getElement());
  }
}
