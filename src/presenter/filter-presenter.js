import AbstractPresenter from './abstract-presenter.js';
import { FilterView } from '../view/index.js';

/** Конфигурация презентера списка.
 * @typedef {Object} PresenterConfig
 * @property {HTMLElement} container - Контейнер для рендера
 * @property {FilterData} filters - Данные отрисовки филтров
 */

/** Модель элемента фильтра для планировщика поездок.
 * @typedef {Object} FilterData
 * @property {string} name - Название фильтра ('Everything', 'Future', 'Past').
 * @property {boolean} isChecked - Статус активности фильтра (true/false).
 */

/** Презентер фильтров. Отвечает за рендеринг компонента фильтров. */
export default class FilterPresenter extends AbstractPresenter {
  /** @param {PresenterConfig} config */
  constructor({ container, filters }) {
    super(container, new FilterView(filters));
  }
}
