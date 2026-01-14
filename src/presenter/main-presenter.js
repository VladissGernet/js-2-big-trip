import HeaderPresenter from './header-presenter.js';
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

  #headerPresenter;
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

  #initHeader() {
    this.#headerPresenter = new HeaderPresenter({
      container: this.#pageBody,
    });
    this.#headerPresenter.init();
  }

  #initPageMain() {
    this.#pageMainPresenter = new PageMainPresenter({
      container: this.#pageBody,
      model: this.#model,
    });
    this.#pageMainPresenter.init(this.#headerPresenter.filterControls);
  }

  // TODO Остановился на этом моменте по прокидыванию данной кнопки по созданию новой точки
  #initNewEventBtn() {
    // Прокинуть эту кнопку в header презентр и далее обновить лисенер
    this.#newEventBtnPresenter = new NewEventBtnPresenter({
      btnElement: this.#headerPresenter.eventAddBtn.element,
      model: this.#model,
      tripEventsEmpty: this.#pageMainPresenter.tripEventsEmpty,
      listView: this.#pageMainPresenter.listView,
      filterControls: this.#headerPresenter.filterControls,
      tripEvents: this.#pageMainPresenter.tripEvents,
    });
    this.#newEventBtnPresenter.init();
  }
}
