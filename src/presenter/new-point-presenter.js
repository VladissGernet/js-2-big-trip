import { BtnView } from '../view/index.js';
import PointFormPresenter from './point-form-presenter.js';
import { render, RenderPosition } from '../framework/render.js';
import {
  FilterType,
  FilterStatus,
  DEFAULT_BASE_PRICE,
  DEFAULT_MINUTES_ADDITION,
} from '../const.js';

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

  #handleBtnClick = () => {
    // Сбрасываем значение в модели.
    this.#filterModel.setFilter(FilterStatus.DEFAULT, FilterType.EVERYTHING);

    // Сбрасываем фильтр в header на изначальный.
    this.#filterPresenter.setDefaultControl();

    // Первый попавшийся город.
    const defaultCity = this.#tripModel.destinationsById.keys().next().value;

    // Создаем презентер формы для отрисовки view.
    this.#pointFormPresenter = new PointFormPresenter({
      tripModel: this.#tripModel,
      filterModel: this.#filterModel,
      pointData: NewPointPresenter.#createDefaultPointDataConfig(
        this.#tripModel.defaultTypeOffer,
        defaultCity,
      ),
      isEditForm: false,
      newPointPresenter: this,
      pageMainPresenter: this.#pageMainPresenter,
    });

    // Отключаем возможность нажатия кнопки.
    this.disable();

    // Добавляю форму создания новой точки в самый верх списка.
    if (this.#tripModel.listPoints.length) {
      // Перерисовываем список, чтобы выполнить условие ТЗ (сделать переключение на вкладку
      // фильтрова "everything").
      this.#pageMainPresenter.renderEventsSection({
        filter: FilterType.EVERYTHING,
      });
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
      isNoPoints: true,
    });

    render(
      this.#pointFormPresenter.component,
      this.#pageMainPresenter.listView.element,
      RenderPosition.AFTERBEGIN,
    );
  };

  /** Данные создания формы по умолчанию */
  static #createDefaultPointDataConfig(type, destinationId) {
    // Дефолтные значения с разницей 1 минута (для серверной валидации).
    const dateFrom = new Date();
    const dateTo = new Date();
    dateTo.setMinutes(dateTo.getMinutes() + DEFAULT_MINUTES_ADDITION);

    return {
      basePrice: DEFAULT_BASE_PRICE,
      dateFrom: dateFrom.toISOString(),
      dateTo: dateTo.toISOString(),
      destination: destinationId,
      isFavorite: false,
      offers: new Map(),
      type,
    };
  }
}
