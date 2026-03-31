import { ListView } from '../view/index.js';
import { render } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { FilterType, SORT_CONFIG } from '../const.js';

import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

/** Конфигурация презентера списка.
 * @typedef {Object} PresenterConfig
 * @property {HTMLElement} container - Контейнер для рендера
 * @property {TripModel} tripModel - Модель данных поездки
 */

/** Презентер списка. Отвечает за рендеринг компонента Списка. */
export default class ListPresenter {
  #newEventBtnPresenter = null;
  #container = null;

  #tripModel = null;
  #filterModel = null;

  #pointPresenters = new Map();

  /** Публичный доступ для управления списком представления из header презентера при создании новой точки. */
  listView = new ListView();

  /** @param {PresenterConfig} config - Конфигурация презентера */
  constructor({ container, tripModel, newEventBtnPresenter, filterModel }) {
    this.#container = container;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
    this.#newEventBtnPresenter = newEventBtnPresenter;

    this.#filterModel.addObserver(this.#handleModeEvent);
  }

  init(sortedList) {
    this.#renderList(sortedList);
  }

  /** Полная очистка списка и коллекции презентеров. */
  clearList() {
    this.listView.element.innerHTML = '';
    this.#pointPresenters.forEach((presenter) => presenter.clear());
    this.#pointPresenters.clear();
  }

  // Перерисовывает список
  resetListView = () => {
    this.#pointPresenters.forEach((presenter) =>
      presenter.fullReplaceFormToPoint(),
    );
  };

  // Удаляет из списка
  removeFromPointPresenters = (id) => this.#pointPresenters.delete(id);

  #renderList(sortedList = null) {
    if (!sortedList) {
      /** Значение для выделения нужных дат */
      const currentFilter = this.#filterModel.filter;

      // Добавляем путевые точки до рендера.

      const filteredList = ListPresenter.filterList(
        currentFilter,
        this.#tripModel.listPoints,
      );

      filteredList
        .sort(SORT_CONFIG['date'])
        .forEach((point) => this.#createPoint(point));

      render(this.listView, this.#container);
      return;
    }

    sortedList.forEach((point) => this.#createPoint(point));
    render(this.listView, this.#container);
  }

  #createPoint(point) {
    const pointPresenter = new PointPresenter({
      point,
      listElement: this.listView.element,
      tripEventsElement: this.#container,
      tripModel: this.#tripModel,
      newEventBtnPresenter: this.#newEventBtnPresenter,
      resetListView: this.resetListView,
      removeFromPointPresenters: this.removeFromPointPresenters,
    });
    pointPresenter.init();
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleModeEvent = () => {
    this.#newEventBtnPresenter.closeForm();
    this.clearList();
    this.init();
  };

  /** Возвращает отфильтрованный список согласно типу филтра. */
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
