import { BtnView } from '../view/index.js';
import PointFormPresenter from './point-form-presenter.js';
import { render, RenderPosition } from '../framework/render.js';
import { FilterType, FilterStatus } from '../const.js';

/** Конфиг презентера обработчика событйи на кнопку создания новго события.
 * @typedef {Object} PresenterConfig - Параметры для создания обработчика
 * @property {Object} tripModel - Модель данных поездки
 * @property {Class} filterModel - Модель фильтра с наблюдателем.
 * @property {HTMLDivElement} containerElement - Элемент для рендера кнопки в header.
 * @property {Class} pageMainPresenter - Презентер main.
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
    this.#newEventBtn = new BtnView({
      className: 'trip-main__event-add-btn btn btn--big btn--yellow',
      onClick: this.#handleBtnClick,
    });

    render(this.#newEventBtn, this.#containerElement);
  }

  /** Подключает презетнер главной страницы main. */
  connectPageMainPresenter(pageMainPresenter) {
    this.#pageMainPresenter = pageMainPresenter;
  }

  destroy() {
    if (!this.#pointFormPresenter) {
      return;
    }
    this.#newEventBtn.element.disabled = false;
  }

  get pointFormPresenterStatus() {
    return this.#pointFormPresenter;
  }

  #handleBtnClick = () => {
    // Сбрасываем значение в модели.
    this.#filterModel.setFilter(FilterType.EVERYTHING, FilterStatus.DEFAULT);

    // Сбрасываем фильтр в header (Перерисовываем DOM элемент).
    this.#filterPresenter.resetView();

    // Создаем презентер формы для отрисовки view.
    this.#pointFormPresenter = new PointFormPresenter({
      tripModel: this.#tripModel,
      filterModel: this.#filterModel,
      isEditForm: false,
      newPointPresenter: this,
    });

    // Отключаем возможность нажатия кнопки.
    this.#newEventBtn.element.disabled = true;

    // Перерисовываем список, чтобы выполнить условие ТЗ, т.е. сделать переключение на вкладку
    // фильтрова "everything".
    this.#pageMainPresenter.renderEventsSection();

    // Добавляю форму создания новой точки в самый верх списка.
    if (this.#tripModel.listPoints.length) {
      render(
        this.#pointFormPresenter.component,
        this.#pageMainPresenter.listView.element,
        RenderPosition.AFTERBEGIN,
      );
    }
    // TODO
    // Остановился здесь на создании формы при пустом списке this.#tripModel.listPoints.length
    return;
  };
}
