import HeaderPresenter from './header-presenter.js';
import PageMainPresenter from './page-main-presenter.js';

/** Конфигурация презентера.
 * @typedef {Object} PresenterConfig
 * @property {Model} tripModel - Данные модели для рендера страницы
 * @property {HTMLBodyElement} pageBody - Видимая часть страницы body.
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
    this.#connectPageMainPresenter();

    this.#tripModel.init();
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
      newPointPresenter: this.#headerPresenter.newPointPresenter,
    });
    this.#pageMainPresenter.init();
  }

  /** Связывает компоненты PageMain с кнопкой создания новой точки маршрута в Header.*/
  #connectPageMainPresenter() {
    this.#headerPresenter.connectPageMainPresenter(this.#pageMainPresenter);
  }
}
