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
  #model;

  #pageHeaderPresenter;
  #pageMainPresenter;
  #newEventBtnPresenter;

  /** @param {PresenterConfig} */
  constructor({ model, pageBody }) {
    this.#pageBody = pageBody;
    this.#model = model;
  }

  init() {
    this.#initHeader();
    this.#initPageMain();
    this.#initNewEventBtn();
  }

  // TODO погружаюсь в page header для рефакторинга
  #initHeader() {
    this.#pageHeaderPresenter = new PageHeaderPresenter({
      container: this.#pageBody,
    });
    this.#pageHeaderPresenter.init();
  }

  #initPageMain() {
    this.#pageMainPresenter = new PageMainPresenter({
      container: this.#pageBody,
      model: this.#model,
    });
    this.#pageMainPresenter.init(this.#pageHeaderPresenter.filterControls);
  }

  #initNewEventBtn() {
    this.#newEventBtnPresenter = new NewEventBtnPresenter({
      btnElement: this.#pageHeaderPresenter.eventAddBtn.element,
      model: this.#model,
      tripEventsEmpty: this.#pageMainPresenter.tripEventsEmpty,
      listView: this.#pageMainPresenter.listView,
      filterControls: this.#pageHeaderPresenter.filterControls,
      tripEvents: this.#pageMainPresenter.tripEvents,
    });
    this.#newEventBtnPresenter.init();
  }
}
