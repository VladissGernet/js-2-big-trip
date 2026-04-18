import { ListPointFormView } from '../view/index.js';
import PointPresenter from './point-presenter.js';
import { remove } from '../framework/render.js';

/** Конфигурация презентера формы путевой точки.
 * @typedef {Object} PointFormConfig
 * @property {Class} filterModel - Модель фильтра с наблюдателем.
 * @property {Object} pointData - Данные точки маршрута.
 * @property {Object} tripModel - Модель данных поездки.
 * @property {Class} pointPresenter - Презентер точки.
 * @property {Class} pageMainPresenter - Презентер страницы Main.
 * @property {Class} newPointPresenter - Презентер создания новой точки.
 * @property {Boolean} isEditForm - Флаг решения какая форма будет, либо редактирование (true),
 * либо создание новой точки.
 * @property {function(): void} onRolldownClick - Функция‑callback (обработчик клика), которая
 * закрывает форму.
 * @property {function(): void} removeFromPointPresenters - Функция‑callback, удаляющая
 * из коллекции Map в listPresenter.
 */

export default class PointFormPresenter {
  // Общие данные.
  #tripModel = null;
  #filterModel = null;
  #isEditForm = null;
  #pageMainPresenter = null;

  // Данные существующей точки.
  #pointData = null;
  #pointPresenter = null;
  #handleRolldownClick = null;
  #removeFromPointPresenters = null;
  // Данные новой точки.
  #newPointPresenter = null;

  #pointFormComponent = null;

  /** @param {PointFormConfig} config - Конфигурация презентера */
  constructor({
    tripModel,
    filterModel,
    isEditForm,
    pointData,
    pointPresenter,
    pageMainPresenter,
    onRolldownClick,
    removeFromPointPresenters,
    newPointPresenter,
  }) {
    // Общие данные.
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
    this.#isEditForm = isEditForm;

    // Данные существующей точки.
    this.#pointData = pointData;
    this.#pointPresenter = pointPresenter;
    this.#pageMainPresenter = pageMainPresenter;
    this.#handleRolldownClick = onRolldownClick;
    this.#removeFromPointPresenters = removeFromPointPresenters;

    // Данные новой точки.
    this.#newPointPresenter = newPointPresenter;

    // Добавление обработчкиа закрытия по Esc.
    document.addEventListener('keydown', this.#escKeyDownHandler);

    // CallBack на событие смены фильтра для очистки формы и её обработчкиа нажатия на Esc.
    this.#filterModel.addObserver(this.destroy);
  }

  /** Закрытие по нажатию ESC. */
  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      document.removeEventListener('keydown', this.#escKeyDownHandler);

      if (!this.#isEditForm) {
        // Если форма создания новой точки, то просто все убираем.
        this.#newPointPresenter.destroy();
        return;
      }

      // Если форма редактирования точки, то закрываем форму.
      this.#pointPresenter.fullReplaceFormToPoint();
      this.destroy();
    }
  };

  /** Добавление\сохранение данных формы. */
  #handleFormSubmit = (evt) => {
    const currentState = this.#pointFormComponent._state;
    const formData = new FormData(evt.target);
    const newData = PointFormPresenter.#preparePointData({
      formData,
      tripModel: this.#tripModel,
      currentState,
      pointData: this.#pointData,
    });
    if (this.#isEditForm) {
      this.#tripModel.updatePoint(currentState.listPoint.id, newData);
      this.destroy();
    } else {
      this.#tripModel.addPoint(newData);
      this.#newPointPresenter.destroy();
    }
    this.#pageMainPresenter.renderEventsSection();
  };

  /** Удаляент компонент презентера формы.
   * Для передачи callback в removeObserver необходима стрелочнкая функция.
   */
  destroy = () => {
    this.#filterModel.removeObserver(this.destroy);
    document.removeEventListener('keydown', this.#escKeyDownHandler);

    remove(this.#pointFormComponent);
    this.#pointFormComponent = null;
  };

  /** Удаляет точку из списка. */
  #removePoint() {
    // Очищаем презентер точки.
    this.#pointPresenter.clear();
    this.#pointPresenter = null;

    // Удаление из данных модели.
    const selectedPointId = this.#pointData.id;
    this.#tripModel.removePoint(selectedPointId);

    // Удаление из коллекции Map презентеров точек.
    this.#removeFromPointPresenters(this.#pointData.id);
  }

  /** Удаление текущей Point из списка. */
  #handleResetClick = () => {
    if (this.#isEditForm) {
      this.#removePoint();
      this.#pageMainPresenter.renderEventsSection(this.#filterModel.filter);
      return;
    }
    this.#newPointPresenter.destroy();
  };

  get component() {
    if (!this.#pointFormComponent) {
      const viewPointData = this.#pointData
        ? PointPresenter.createViewPointData(this.#tripModel, this.#pointData)
        : null;

      this.#pointFormComponent = new ListPointFormView({
        viewPointData: viewPointData,
        isEditForm: this.#isEditForm,
        tripModel: this.#tripModel,
        onRolldownClick: this.#handleRolldownClick,
        onFormSubmit: this.#handleFormSubmit,
        onResetClick: this.#handleResetClick,
      });
    }
    return this.#pointFormComponent;
  }

  /** Подготавливает данные для отправки. */
  static #preparePointData({
    formData,
    tripModel,
    currentState,
    pointData = null,
  }) {
    const pointId = pointData === null ? '' : pointData.id;
    const isFavorite = pointData === null ? false : pointData.isFavorite;

    let data = {};

    // Получаем стоимость.
    const price = formData.get('event-price');

    // Преобразовывает название пункта назначения в соответсвующий ему id.
    const destinationName = formData.get('event-destination');
    const destination = destinationName
      ? tripModel.transformDestinationNameToId(destinationName)
      : '';

    // Получаем тип для массива предложений.
    const type = formData.get('event-type');

    // Получаем массив выбранных предложений (offers), которые также нужно
    // преобразовать в id.
    const selectedOffers = formData.getAll('event-offers');
    // Получаем коллекцию Map всех предложаний по типу.
    const allOffers = tripModel.offersByType.get(type);

    // Создаём обратный Map для быстрого поиска по title (один раз O(n))
    const titleToId = new Map();
    for (const [id, { title }] of allOffers) {
      titleToId.set(title.toLowerCase(), id);
    }
    // Массив из выбранных значений.
    const selectedIdOffers = selectedOffers.map((offer) =>
      titleToId.get(offer.toLowerCase()),
    );

    data = {
      id: pointId,
      basePrice: price,
      dateFrom: currentState.listPoint.dateFrom,
      dateTo: currentState.listPoint.dateTo,
      destination,
      isFavorite,
      offers: new Set(selectedIdOffers),
      type,
    };

    return data;
  }
}
