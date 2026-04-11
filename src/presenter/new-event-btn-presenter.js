import { TripEventsEmptyView, BtnView } from '../view/index.js';
import PointFormPresenter from './point-form-presenter.js';
import { render, RenderPosition } from '../framework/render.js';
import { FilterType } from '../const.js';

/** Конфиг презентера обработчика событйи на кнопку создания новго события.
 * @typedef {Object} PresenterConfig - Параметры для создания обработчика
 * @property {Object} tripModel - Модель данных поездки
 * @property {Class} filterModel - Модель фильтра с наблюдателем.
 * @property {HTMLDivElement} containerElement - Элемент для рендера кнопки.
 * @property {Object} tripEventsEmpty - Компонент сообщения об отсутсвии путевых точек.
 * @property {Class} listPresenter - Презентер списка.
 * @property {Class} filterPresenter - Презентер фильтра списка.
 * @property {HTMLElement} tripEvents - Компонент секции главной страницы.
 */

export default class NewEventBtnPresenter {
  #tripModel = null;
  #filterModel = null;
  #containerElement = null;
  #tripEvents = null;
  #tripEventsEmpty = null;
  #listPresenter = null;
  #pointFormPresenter = null;
  #filterPresenter = null;

  #newList = null;
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

  /** @param {PresenterConfig} config - Конфигурация презентера
   * @description Подключает компоненты из main после его редера
   */
  connectPageMainComponents({ listPresenter, tripEvents }) {
    this.#listPresenter = listPresenter;
    this.#tripEvents = tripEvents;
  }

  destroy() {
    if (!this.#pointFormPresenter) {
      return;
    }
    this.#newEventBtn.element.disabled = false;
    if (this.#tripModel.listPoints.length === 0) {
      this.#renderEmptyMessage();
    }
  }

  #renderEmptyMessage() {
    this.#newList = null;
    this.#tripEventsEmpty = new TripEventsEmptyView();
    render(this.#tripEventsEmpty, this.#tripEvents.element);
  }

  #handleBtnClick = () => {
    // Сбрасываем значение в модели.
    this.#filterModel.setFilter(FilterType.EVERYTHING);

    // Сбрасываем фильтр.
    this.#filterPresenter.resetView();

    if (this.#listPresenter) {
      this.#listPresenter.resetListView();
    }

    // Создаем презентер формы для отрисовки view.
    this.#pointFormPresenter = new PointFormPresenter({
      tripModel: this.#tripModel,
      isEditForm: false,
      newEventBtnPresenter: this,
    });

    // Отключаем возможность нажатия кнопки.
    this.#newEventBtn.element.disabled = true;

    if (this.#tripModel.listPoints.length) {
      render(
        this.#pointFormPresenter.component,
        this.#listPresenter.listView.element,
        RenderPosition.AFTERBEGIN,
      );
    }

    // TODO выношу в презентер формы точки
    // if (this.#tripModel.listPoints.length === 0) {
    //   // Очищаю таблицу.
    //   console.log(this.#tripEventsEmpty);

    //   remove(this.#tripEventsEmpty);
    //   this.#tripEvents.element.innerHTML =
    //     '<h2 class="visually-hidden">Trip events</h2>';

    //   // Создаю новый список.
    //   this.#newList = new ListView();
    //   render(this.#newList, this.#tripEvents.element);
    //   render(this.#pointFormPresenter.component, this.#newList.element);
    // } else {
    //   render(
    //     this.#pointFormPresenter.component,
    //     this.#listPresenter.listView.element,
    //     RenderPosition.AFTERBEGIN,
    //   );
    // }
  };
}
