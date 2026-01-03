import { render } from '../framework/render.js';
import { PageMainView, TripEventsView } from '../view/index.js';
import SortPresenter from '../presenter/sort-presenter.js';
import ListPresenter from '../presenter/list-presenter.js';

import { TRIP_SORTS } from '../const.js';

/** Конфигурация презентера списка.
 * @typedef {Object} PresenterConfig
 * @property {HTMLElement} container - Контейнер для рендера
 * @property {Model} model - Данные модели для рендера страницы
 */

/** Презентер основного содержимого страницы */
export default class PageMainPresenter {
  /**
   * @param {PresenterConfig}
   */
  constructor({ container: container, model: model }) {
    this.#container = container;
    this.#model = model;
  }

  #model;
  #container;

  /** Доступ к компоненту списка
   * @type {HTMLUlistElement} - элемент разметки
   */
  listView;

  init(headerPresenter) {
    const main = new PageMainView();
    const tripEvents = new TripEventsView();

    render(main, this.#container);
    render(tripEvents, main.container);

    /* TODO
    Реализовать экран сообщения с приглашением добавить первую точку маршрута.
    Сообщение должно появляться вместо списка точек маршрута. Разметку
    сообщения вы найдёте в директории /markup.

      Значение отображаемого текста зависит от выбранного фильтра:
    * Everthing – 'Click New Event to create your first point'
    * Past — 'There are no past events now';
    * Present — 'There are no present events now';
    * Future — 'There are no future events now'.


    0. Убрать абстрактный презентер.
    1. Нужно прокинуть текущее значение выбранного фильтра.
    2. Проверить наличие данных и при отсутсвии показать нужное сообщение.
    3. реализовать добавление нового события.
  */

    console.log(headerPresenter);

    const sortPresenter = new SortPresenter({
      container: tripEvents.element,
      sorts: TRIP_SORTS,
    });
    const listPresenter = new ListPresenter({
      container: tripEvents.element,
      tripModel: this.#model,
    });

    sortPresenter.init();
    listPresenter.init();

    this.listView = listPresenter.listView;
  }
}
