import HeaderPresenter from './header-presenter.js';
import PageMainPresenter from './page-main-presenter.js';

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

  /** @param {PresenterConfig} */
  constructor({ model, pageBody }) {
    this.#pageBody = pageBody;
    this.#model = model;
  }

  init() {
    this.#initHeader();
    this.#initPageMain();
    this.#connectPageMainComponents();
  }

  #initHeader() {
    this.#headerPresenter = new HeaderPresenter({
      container: this.#pageBody,
      model: this.#model,
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

  /** Связывает компоненты PageMain с кнопкой создания новой точки маршурта в header. */
  #connectPageMainComponents() {
    this.#headerPresenter.connectPageMainComponents({
      tripEventsEmpty: this.#pageMainPresenter.tripEventsEmpty,
      listPresenter: this.#pageMainPresenter.listPresenter,
      tripEvents: this.#pageMainPresenter.tripEvents,
    });
  }
}
