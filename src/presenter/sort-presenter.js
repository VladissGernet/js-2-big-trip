import AbstractPresenter from './abstract-presenter.js';
import { SortView } from '../view/index.js';

/** Конфигурация презентера Сортировки.
 * @typedef {Object} PresenterConfig
 * @property {HTMLElement} container - Контейнер для рендера
 * @property {SortsData} sorts - Данные отрисовки сортировки
 */

/** Модель элемента сортировки для планировщика поездок.
 * @typedef {Object} SortsData
 * @property {string} name - Название сортировки ('Day', 'Event', 'Time').
 * @property {boolean} isChecked - Статус выбора сортировки (true/false).
 * @property {boolean} isDisabled - Статус активности сортировки (true/false).
 */

/** Презентер сортировки. Отвечает за рендеринг компонента сортирвки. */
export default class SortPresenter extends AbstractPresenter {
  constructor({ container, sorts }) {
    super(container, new SortView(sorts));
  }
}
