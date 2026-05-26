import { render, remove } from '../framework/render.js';
import {
  PageMainView,
  TripEventsEmptyView,
  TripEventsView,
} from '../view/index.js';
import SortPresenter from './sort-presenter.js';
import ListPresenter from './list-presenter.js';
import FilterPresenter from './filter-presenter.js';
import {
  FilterStatus,
  NO_EVENTS_MESSAGES,
  FilterType,
  LoadStatus,
} from '../const.js';

/** Конфигурация презентера списка.
 * @typedef {Object} PresenterConfig
 * @property {HTMLElement} container - Контейнер для рендера
 * @property {Model} tripModel - Данные модели для рендера страницы
 * @property {Class} filterModel - Модель фильтра с наблюдателем.
 * @property {Class} newPointPresenter - Презентер кнопки создания нового события.
 */

/** Презентер основного содержимого страницы */
export default class PageMainPresenter {
  #container = null;
  #tripModel = null;
  #filterModel = null;
  #newPointPresenter = null;

  #mainView = new PageMainView();
  #tripEventsView = null;
  #tripEventsEmptyView = null;
  #sortPresenter = null;
  #listPresenter = null;

  /** @param {PresenterConfig} */
  constructor({ container, tripModel, newPointPresenter, filterModel }) {
    this.#container = container;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
    this.#newPointPresenter = newPointPresenter;

    this.#filterModel.addObserver(this.#handleFilterStatus);
    this.#tripModel.addObserver(this.#handleLoadStatus);
  }

  get tripEventsView() {
    return this.#tripEventsView;
  }

  get listView() {
    return this.#listPresenter.listView;
  }

  init() {
    this.#renderMain();
  }

  resetListView(sortedList) {
    // Закрывает открытые формы редактирования\создания точки.
    this.#listPresenter.resetListView();
    // Удаляет список точек.
    this.#listPresenter.destroy();
    // Создает новый список точек с новыми данными sortedList.
    this.#listPresenter.init(sortedList);
  }

  renderEventsSection({
    filter = null,
    isRenderNewPointForm = false,
    loadStatus,
  } = {}) {
    /*
      Сценарии отработки:
        1.Первая загрузка данных;
          1.1. Успешная загрузка данных:
            1.1.2. Если есть 1 или более точек.
            1.1.3. Точек нет, пустое сообщение.
          1.2. Ошибка при загрузке данных.

        2. Удаление точки.
          2.1. Удаление очередной точки, т.е. не последней в списке.
          2.2. Удаление последней в списке точки. Рендер сообщения об отсутствии точек, отключение
          соответствующего фильтра.
        3. Редактирование существующей точки.
          3.1. Сохранение изменений.

        4. Добавление точки.
          4.1. Создание формы.
            4.1.1. При наличии точек.
            4.1.2. При отсутствии точек.
          4.2.
            4.2.1. Отправка данных.
            4.2.2. Отмена создания точки по клику на Cancel.
            4.2.3. Закрытие по нажатию ESC.
        5. Смена фильтра "Everything", "Future", "Present", "Past".
          5.1. Без формы создания точки (форма просто должана закрыться без отрабатывания текущего метода).
          5.2. С формой создания точки (форма просто должана закрыться без отрабатывания текущего метода).
          5.3. Без формы редактирования точки (форма просто должана закрыться без отрабатывания текущего метода).
          5.4. С формой редактирования точки (форма просто должана закрыться без отрабатывания текущего метода).
          5.5. При нестанартной сортировке "Time", "Price".
          5.6. Обычное переключение фильтра.
        6. Смена сортировки "Day", "Time", "Price" при разных фильтрах.
          6.1. Без формы создания точки (форма просто должана закрыться без отрабатывания текущего метода).
          6.2. С формой создания точки (форма просто должана закрыться без отрабатывания текущего метода).
          6.3. Без формы редактирования точки (форма просто должана закрыться без отрабатывания текущего метода).
          6.4. С формой редактирования точки (форма просто должана закрыться без отрабатывания текущего метода).
          6.5. При нестанартном значении фильтра "Future", "Present", "Past".
          6.6. Обычное переключение сортировки.
    */
    this.#renderTripEvents();
    // Рендер при создании новой точки.
    if (isRenderNewPointForm) {
      this.#listPresenter = new ListPresenter(this.#createCommonConfig());
      this.#listPresenter.init();
      return;
    }

    const points = this.#tripModel.listPoints;

    // Если фильтр переключен или передан.
    if (filter) {
      /** Список, с которым будет фильтрация. */
      const filteredPoints = FilterPresenter.filterList(filter, points);
      this.#renderEventsOrEmpty(filteredPoints, { filter });
      return;
    }

    // Рендер по умолчанию.
    this.#renderEventsOrEmpty(points, { loadStatus });
  }

  #renderTripEvents() {
    if (this.#tripEventsView) {
      this.#destroyTripEventsView();
    }

    this.#tripEventsView = new TripEventsView();
    render(this.#tripEventsView, this.#mainView.container);
  }

  #renderEventsOrEmpty(points, options = {}) {
    if (points?.length) {
      this.#renderEvents();
    } else {
      this.#renderEmptyMessage(options);
    }
  }

  /** Очищает элемент tripEvents. */
  #destroyTripEventsView() {
    if (this.#listPresenter) {
      this.#listPresenter.destroy();
      this.#listPresenter = null;
    }

    if (this.#sortPresenter) {
      this.#sortPresenter.destroy();
      this.#sortPresenter = null;
    }

    remove(this.#tripEventsView);
    this.#tripEventsEmptyView = null;
  }

  /** Рендер до загрузки данных. */
  #renderMain() {
    render(this.#mainView, this.#container);
    this.renderEventsSection({ loadStatus: LoadStatus.LOADING });
  }

  #renderEvents() {
    // Сперва необходимо создать презентер списка для его передачи
    // презентеру сортировки.
    this.#listPresenter = new ListPresenter(this.#createCommonConfig());
    this.#sortPresenter = new SortPresenter(this.#createCommonConfig());

    this.#sortPresenter.init();
    this.#listPresenter.init();
  }

  #createCommonConfig() {
    return {
      pageMainPresenter: this,
      tripModel: this.#tripModel,
      filterModel: this.#filterModel,
      newPointPresenter: this.#newPointPresenter,
    };
  }

  #renderEmptyMessage({ filter, loadStatus } = {}) {
    const result = this.#getEmptyMessage({ filter, loadStatus });
    this.#tripEventsEmptyView = new TripEventsEmptyView(result);
    render(this.#tripEventsEmptyView, this.#tripEventsView.element);
  }

  #getEmptyMessage({ filter = null, loadStatus = null }) {
    if (loadStatus) {
      return NO_EVENTS_MESSAGES[loadStatus];
    }
    return NO_EVENTS_MESSAGES[filter || FilterType.EVERYTHING];
  }

  #handleFilterStatus = (filter, status) => {
    if (status !== FilterStatus.CHANGE) {
      return;
    }

    // Очищаем презентер новой точки.
    this.#newPointPresenter.destroy();

    // Очищаем элемент для нового рендера.
    this.renderEventsSection({ filter });
  };

  #handleLoadStatus = (status) => {
    if (status === LoadStatus.RESOLVED) {
      this.renderEventsSection();
    } else if (status === LoadStatus.REJECTED) {
      this.renderEventsSection({ loadStatus: LoadStatus.REJECTED });
    }
    this.#tripModel.removeObserver(this.#handleLoadStatus);
  };
}
