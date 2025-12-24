import AbstractPresenter from './abstract-presenter.js';
import SortFormView from '../view/sort-view/sort-form-view.js';

/**
 * Презентер сортировки. Отвечает за рендеринг компонента сортирвки.
 */
export default class SortPresenter extends AbstractPresenter {
  constructor({ sortContainer, sorts }) {
    super(sortContainer, new SortFormView(sorts));
  }
}
