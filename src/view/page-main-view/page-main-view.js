import { html } from '../../utils/index.js';
import AbstractView from './../../framework/view/abstract-view.js';

export default class PageMainView extends AbstractView {
  get template() {
    return html`
      <main class="page-body__page-main page-main">
        <div class="page-body__container"></div>
      </main>
    `;
  }

  get container() {
    return this.element.querySelector('.page-body__container');
  }
}
