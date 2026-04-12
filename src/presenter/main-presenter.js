import HeaderPresenter from './header-presenter.js';
import PageMainPresenter from './page-main-presenter.js';

/** Конфигурация презентера.
 * @typedef {Object} PresenterConfig
 * @property {Model} tripModel - Данные модели для рендера страницы
 * @property {HTMLBodyElement} pageBody - Видимая часть страницы.
 * @property {Class} filterModel - Модель фильтра с наблюдателем.
 */

export default class MainPresenter {
  #pageBody = null;

  #tripModel = null;
  #filterModel = null;

  #headerPresenter = null;
  #pageMainPresenter = null;

  /** @param {PresenterConfig} */
  constructor({ tripModel, pageBody, filterModel }) {
    this.#pageBody = pageBody;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
  }

  init() {
    this.#initHeader();
    this.#initPageMain();
    this.#connectPageMainComponents();
  }

  #initHeader() {
    this.#headerPresenter = new HeaderPresenter({
      container: this.#pageBody,
      tripModel: this.#tripModel,
      filterModel: this.#filterModel,
    });

    this.#headerPresenter.init();
  }

  #initPageMain() {
    this.#pageMainPresenter = new PageMainPresenter({
      container: this.#pageBody,
      tripModel: this.#tripModel,
      filterModel: this.#filterModel,
      // TODO
      // Сделать тоже более абстрактно, т.е. не нужно знать PageMainPresenter о каком-то newEventBtnPresenter,
      // а просто передать публичный метод от headerPresenter, который будет делать закрытие формы или еще чего.
      newEventBtnPresenter: this.#headerPresenter.newEventBtnPresenter,
    });

    this.#pageMainPresenter.init();
  }

  /** Связывает компоненты PageMain с кнопкой создания новой точки маршурта в Header. */
  #connectPageMainComponents() {
    this.#headerPresenter.connectPageMainComponents({
      pageMainPresenter: this.#pageMainPresenter,
      tripEvents: this.#pageMainPresenter.tripEvents,
    });
  }
}
