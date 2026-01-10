import { html } from '../../utils/index.js';
import AbstractView from './../../framework/view/abstract-view.js';

function createPageHeaderTemplate() {
  return html`
    <header class="page-header">
      <div class="page-body__container page-header__container">
        <img
          class="page-header__logo"
          src="img/logo.png"
          width="42"
          height="42"
          alt="Trip logo"
        />
      </div>
    </header>
  `;
}

export default class PageHeaderView extends AbstractView {
  get template() {
    return createPageHeaderTemplate();
  }

  get container() {
    return this.element.querySelector('.page-header__container');
  }
}
