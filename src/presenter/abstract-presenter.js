import { render } from '../framework/render.js';

/**
 * Абстрактный класс presenter
 */
export default class AbstractPresenter {
  /** @type {HTMLElement} Контейнер */
  #container = null;

  /** @type {HTMLDivElement} View компонет контейнера */
  #viewComponent = null;

  constructor(container, viewComponent) {
    if (new.target === AbstractPresenter) {
      throw new Error(`
        Can't instantiate AbstractView, only concrete one.
      `);
    }
    this.#container = container;
    this.#viewComponent = viewComponent;
  }

  /**
   * Инициализация презентера
   */
  init() {
    render(this.#viewComponent, this.#container);
  }
}
