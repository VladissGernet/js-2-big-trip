import { FilterView } from '../view/index.js';
import { render, replace, remove } from '../framework/render.js';
import { FilterType, FilterStatus } from '../const.js';

// Библиотека dayjs.
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

/** Конфигурация презентера списка.
 * @typedef {Object} PresenterConfig
 * @property {HTMLElement} container - Контейнер для рендера
 * @property {FilterData} filters - Данные отрисовки филтров
 * @property {Class} filterModel - Модель фильтра с наблюдателем.
 */

/** Модель элемента фильтра для планировщика поездок.
 * @typedef {Object} FilterData
 * @property {string} name - Название фильтра ('Everything', 'Future', 'Past').
 * @property {boolean} isChecked - Статус активности фильтра (Boolean).
 */

/** Презентер фильтров. Отвечает за рендеринг компонента фильтров. */
export default class FilterPresenter {
  #container = null;
  #filterModel = null;

  #filterComponent = null;

  /** @param {PresenterConfig} config */
  constructor({ container, filterModel }) {
    this.#container = container;
    this.#filterModel = filterModel;
  }

  init() {
    this.#renderFilterComponent();
  }

  disable() {
    this.#filterComponent.controls.forEach(
      (control) => (control.disabled = true),
    );
  }

  enable() {
    // TODO, продумать логику обновления в случае пустого элемента, кроме everything
    this.#filterComponent.controls.forEach(
      (control) => (control.disabled = false),
    );
  }

  resetView() {
    const prevComponent = this.#filterComponent;
    this.#filterComponent = new FilterView(this.#filterChangeHandler);
    replace(this.#filterComponent, prevComponent);
    remove(prevComponent);
  }

  #renderFilterComponent() {
    this.#filterComponent = new FilterView(this.#filterChangeHandler);
    render(this.#filterComponent, this.#container);
  }

  #filterChangeHandler = (evt) => {
    this.#filterModel.setFilter(evt.target.value, FilterStatus.CHANGE);
  };

  /**
   * Возвращает отфильтрованный список согласно типу фильтра.
   * Публичный для переиспользования.
   */
  static filterList(filterType, points) {
    /** Сегодняшняя дата */
    const today = dayjs();

    switch (filterType) {
      case FilterType.FUTURE:
        return points.filter((point) => dayjs(point.dateFrom).isAfter(today));

      case FilterType.PRESENT:
        return points.filter(
          (point) =>
            dayjs(point.dateFrom).isSameOrBefore(today) &&
            dayjs(point.dateTo).isSameOrAfter(today),
        );

      case FilterType.PAST:
        return points.filter((point) => dayjs(point.dateTo).isBefore(today));

      default:
        return points;
    }
  }
}
