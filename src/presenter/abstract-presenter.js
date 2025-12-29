import { render } from '../framework/render.js';

/** Абстрактный класс presenter */
export default class AbstractPresenter {
  /**
   * @param {HTMLElement} container Место, куда будет вствляться view компонент
   * @param {HTMLElement} viewComponent Принимаемый view компонент
   */
  constructor(container, viewComponent) {
    if (new.target === AbstractPresenter) {
      throw new Error(`
        Can't instantiate AbstractView, only concrete one.
      `);
    }
    this.#container = container;
    this.#viewComponent = viewComponent;
  }

  #container;
  #viewComponent;

  /** Инициализация презентера */
  init() {
    render(this.#viewComponent, this.#container);
  }
}
