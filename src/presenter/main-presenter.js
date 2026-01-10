import PageHeaderPresenter from './page-header-presenter.js';
import PageMainPresenter from './page-main-presenter.js';
import NewEventBtnPresenter from './new-event-btn-presenter.js';

/** Конфигурация презентера.
 * @typedef {Object} PresenterConfig
 * @property {HTMLBodyElement} pageBody - Видимая часть страницы.
 * @property {Model} model - Данные модели для рендера страницы
 */

export default class MainPresenter {
  #pageBody;

  model;

  /** @param {PresenterConfig} */
  constructor({ model, pageBody }) {
    this.#pageBody = pageBody;
    this.model = model;
  }

  init() {
    const pageHeaderPresenter = new PageHeaderPresenter({
      container: this.#pageBody,
    });
    const pageMainPresenter = new PageMainPresenter({
      container: this.#pageBody,
      model: this.model,
    });

    // Редер списка на основе данных с сервера.
    pageHeaderPresenter.init();
    pageMainPresenter.init(pageHeaderPresenter.filterControls);

    // Создание формы добавления новой путевой точки.
    const newEventBtnPresenter = new NewEventBtnPresenter({
      btnElement: pageHeaderPresenter.eventAddBtn.element,
      model: this.model,
      tripEventsEmpty: pageMainPresenter.tripEventsEmpty,
      listView: pageMainPresenter.listView,
      filterControls: pageHeaderPresenter.filterControls,
      tripEvents: pageMainPresenter.tripEvents,
    });
    newEventBtnPresenter.init();
  }
}
