import dayjs from 'dayjs';
import { render } from '../framework/render.js';
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

const SORT_CONFIG = {
  price: ({ basePrice: priceA }, { basePrice: priceB }) => priceB - priceA,
  dateFrom: ({ dateFrom: dateA }, { dateFrom: dateB }) => dateB - dateA,
  time: (
    { dateFrom: dateFromA, dateTo: dateToA },
    { dateFrom: dateFromB, dateTo: dateToB },
  ) => {
    const timeA = dayjs(dateToA).diff(dayjs(dateFromA));
    const timeB = dayjs(dateToB).diff(dayjs(dateFromB));
    return timeA - timeB;
  },
};

/** Презентер сортировки. Отвечает за рендеринг компонента сортирвки списка событйи. */
export default class SortPresenter {
  #container;
  #sorts;
  #component;
  #model;

  /** @param {PresenterConfig} */
  constructor({ container, sorts, model }) {
    this.#container = container;
    this.#sorts = sorts;
    this.#model = model;
  }

  init() {
    this.#model.listPoints.sort(SORT_CONFIG.time);

    this.#renderSort();
  }

  #renderSort() {
    this.#component = new SortView({
      sorts: this.#sorts,
      onChange: this.#handleChange,
    });

    render(this.#component, this.#container);
  }

  #handleChange(evt) {
    console.log(evt.target);
  }
}
