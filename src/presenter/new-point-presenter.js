import { BtnView } from '../view/index.js';
import PointFormPresenter from './point-form-presenter.js';
import { render, RenderPosition } from '../framework/render.js';
import { FilterType, FilterStatus } from '../const.js';

/** Конфиг презентера обработчика событий на кнопку создания нового события.
 * @typedef {Object} PresenterConfig - Параметры для создания обработчика
 * @property {Object} tripModel - Модель данных поездки
 * @property {Class} filterModel - Модель фильтра с наблюдателем.
 * @property {HTMLDivElement} containerElement - Элемент для рендера кнопки в header.
 * @property {Class} filterPresenter - Презентер фильтра списка.
 */

export default class NewPointPresenter {
  #tripModel = null;
  #filterModel = null;
  #containerElement = null;
  #pageMainPresenter = null;
  #pointFormPresenter = null;
  #filterPresenter = null;

  #newEventBtn = null;

  /** @param {PresenterConfig} config - Конфигурация презентера */
  constructor({ tripModel, filterModel, containerElement, filterPresenter }) {
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
    this.#containerElement = containerElement;
    this.#filterPresenter = filterPresenter;
  }

  init() {
    // Добавляем обработчик клика на кнопку создания нового события в Header.
    this.#newEventBtn = new BtnView(this.#handleBtnClick);
    render(this.#newEventBtn, this.#containerElement);
  }

  /** Отключение кнопки.*/
  disable() {
    this.#newEventBtn.element.disabled = true;
  }

  /** Активация кнопки.*/
  enable() {
    this.#newEventBtn.element.disabled = false;
  }

  /**
   * Связывает main страницы с header.
   * @param {Class} pageMainPresenter - Презентер рендера main.
   */
  connectPageMainPresenter(pageMainPresenter) {
    this.#pageMainPresenter = pageMainPresenter;
  }

  destroy() {
    if (!this.#pointFormPresenter) {
      return;
    }
    this.#pointFormPresenter.destroy();
    this.#pointFormPresenter = null;
    this.enable();
  }

  #createPointFormPresenter() {
    // Создаем презентер формы для отрисовки view.
    this.#pointFormPresenter = new PointFormPresenter({
      tripModel: this.#tripModel,
      filterModel: this.#filterModel,
      pointData: NewPointPresenter.#createDefaultPointDataConfig(
        this.#tripModel.defaultTypeOffer,
      ),
      isEditForm: false,
      newPointPresenter: this,
      pageMainPresenter: this.#pageMainPresenter,
    });
  }

  #renderForm() {
    // Добавляю форму создания новой точки в самый верх списка.
    if (this.#tripModel.listPoints.length) {
      const isNotDefaultSortValue = !this.#pageMainPresenter.isDefaultSortValue;
      // Есть фильтр или сортировка по умолчанию, то заново рендер не нужен.
      if (
        this.#filterModel.filter !== FilterType.EVERYTHING ||
        isNotDefaultSortValue
      ) {
        this.#pageMainPresenter.renderEventsSection({
          filter: FilterType.EVERYTHING,
        });
      }

      render(
        this.#pointFormPresenter.component,
        this.#pageMainPresenter.listView.element,
        RenderPosition.AFTERBEGIN,
      );
      return;
    }

    // Если общий список точек пустой, рендер только формы создания новой точки.
    this.#pageMainPresenter.renderEventsSection({
      filter: FilterType.EVERYTHING,
      isRenderNewPointForm: true,
    });
    render(
      this.#pointFormPresenter.component,
      this.#pageMainPresenter.listView.element,
      RenderPosition.AFTERBEGIN,
    );
  }

  #handleBtnClick = () => {
    // TODO Остановился здесь, Нажатие на кнопку «New Event» закрывает открытую форму редактирования точки маршрута
    // Пробпада точка маршрута, если сначала открыть редактирование, потом New Event.

    // Сбрасываем значение в модели.
    this.#filterModel.setFilter(FilterStatus.DEFAULT, FilterType.EVERYTHING);

    // Сбрасываем фильтр в header на изначальный.
    this.#filterPresenter.setDefaultControl();

    this.#createPointFormPresenter();

    // Отключаем возможность нажатия кнопки.
    this.disable();

    this.#renderForm();
  };

  /** Данные создания формы по умолчанию */
  static #createDefaultPointDataConfig(type) {
    return {
      isFavorite: false,
      offers: new Set(),
      type,
    };
  }
}
