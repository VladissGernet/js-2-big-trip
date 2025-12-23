import AbstractPresenter from './abstract-presenter.js';
import FilterFormView from '../view/filter-view/filter-form-view.js';

/**
 * Презентер фильтров. Отвечает за рендеринг компонента фильтров.
 */
export default class FilterPresenter extends AbstractPresenter {
  constructor({ filterContainer, filters }) {
    super(filterContainer, new FilterFormView(filters));
  }
}
