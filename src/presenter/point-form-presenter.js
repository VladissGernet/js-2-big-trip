import { ListPointFormView } from '../view/index.js';
import { remove } from '../framework/render.js';
import {
  transformDestinationNameToId,
  createViewPointData,
} from '../utils/index.js';

/** Конфигурация презентера формы путевой точки.
 * @typedef {Object} PointFormConfig
 * @property {Class} filterModel - Модель фильтра с наблюдателем.
 * @property {Object} tripModel - Модель данных поездки.
 * @property {Object} pointData - Данные точки маршрута.
 * @property {Class} pointPresenter - Презентер точки.
 * @property {Class} pageMainPresenter - Презентер страницы Main.
 * @property {Class} newPointPresenter - Презентер создания новой точки.
 * @property {Boolean} isEditForm - Флаг решения типа формы. Редактирование (true),
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
  // TODO , передать // где‑то в конфиге
  // onFormDestroyed: (formPresenter) => {
  //   this.#pointFormPresenter = null;
  // }
  //   #onFromDestroy;

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
    pointData,
    pointPresenter,
    pageMainPresenter,
    newPointPresenter,
    isEditForm,
    onRolldownClick,
    removeFromPointPresenters,
    // TODO , передать // где‑то в конфиге
    // onFormDestroyed: (formPresenter) => {
    //   this.#pointFormPresenter = null;
    // }
    //   #onFromDestroy;

    // onFormDestroy,
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
    document.addEventListener('keydown', this.#handleEscKeyDown);

    // CallBack на событие смены фильтра для очистки формы и её обработчкиа нажатия на Esc.
    this.#filterModel.addObserver(this.destroy);
  }

  get component() {
    if (!this.#pointFormComponent) {
      this.#pointFormComponent = new ListPointFormView({
        viewPointData: createViewPointData({
          tripModel: this.#tripModel,
          pointData: this.#pointData,
        }),
        isEditForm: this.#isEditForm,
        tripModel: this.#tripModel,
        onRolldownClick: this.#handleRolldownClick,
        onFormSubmit: this.#handleFormSubmit,
        onResetClick: this.#handleResetClick,
        onPriceChange: this.#handlePriceChange,
      });
    }
    return this.#pointFormComponent;
  }

  /**
   * Удаляент компонент презентера формы.
   * Для передачи callback в removeObserver необходима стрелочнкая функция.
   */
  destroy = () => {
    console.log('go');

    // TODO, не удаляются события на 1.6. и если
    // 1. открыть форму
    // 2. переключить на другую сортировку
    // 3. все закроектся но не вызовется destroy.
    // 4. повторитить 1-2 n раз.
    // 5. нажать на esc и вызовет ошибку
    // 6. либо преключить сортировку и вызовет несколько раз одновременно.

    /*
    Сценарии удаления:
      1. Существуящая форма.
        1.1. Нажатие "Save".
        1.2. Нажатие "Delete".
        1.3. Нажатие "Rollup".
        1.4. Нажатие Клавиши ESC.
        1.5. Переключение фильтра (Everything, future, ...).
        1.6. Переключение сортировки (Day, Time, Price, ...).
        1.7. Открытие редактирования другой точки.
        1.8. Создание новой точки.

      2. Новая форма.
        2.1. Нажатие "Save".
        2.2. Нажатие "Cancel".
        2.3. Нажатие Клавиши ESC.
        2.4. Переключение фильтра (Everything, future, ...).
        2.5. Переключение сортировки (Day, Time, Price, ...).
        2.6. Открытие редактирования другой точки.
    */
    // TODO не вызвается при удалении точки, возможно нужно добавить просто в #removePoint
    this.#filterModel.removeObserver(this.destroy);
    document.removeEventListener('keydown', this.#handleEscKeyDown);
    remove(this.#pointFormComponent);
    this.#pointFormComponent = null;
  };

  /** Удаляет существующую точку из списка. */
  #removePoint() {
    // Очищаем презентер точки.
    this.#pointPresenter.clear();
    this.#pointPresenter = null;

    // Удаление из данных модели.
    const selectedPointId = this.#pointData.id;
    this.#tripModel.removePoint(selectedPointId);

    // Удаление из коллекции Map презентеров точек.
    this.#removeFromPointPresenters(selectedPointId);

    this.destroy();
  }

  /** Удаление текущей Point из списка или закрытие создания новой точки. */
  #handleResetClick = () => {
    if (this.#isEditForm) {
      this.#removePoint();
      return;
    }
    this.#newPointPresenter.destroy();
  };

  #handlePriceChange = (evt) => {
    const value = evt.target.value.replace(/[\D]/g, '');
    evt.target.value = value;
  };

  /** Закрытие по нажатию ESC. */
  #handleEscKeyDown = (evt) => {
    if (evt.key !== 'Escape') {
      return;
    }
    evt.preventDefault();
    document.removeEventListener('keydown', this.#handleEscKeyDown);

    if (!this.#isEditForm) {
      // Если форма создания новой точки, то просто все убираем.
      this.#newPointPresenter.destroy();
      return;
    }

    // Если форма редактирования точки, то закрываем форму.
    this.#pointPresenter.fullReplaceFormToPoint();
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

      // TODO, здесь formPresenter делает = null, для очистки.
    } else {
      this.#tripModel.addPoint(newData);
      // TODO, здесь formPresenter делает = null, для очистки. преверить что там
      this.#newPointPresenter.destroy();
    }
    this.#pageMainPresenter.renderEventsSection();
  };

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

    // Получаем базовую стоимость.
    const price = Number(formData.get('event-price'));

    // Преобразовывает название пункта назначения в соответсвующий ему id.
    const destinationName = formData.get('event-destination');
    const destination = transformDestinationNameToId(
      destinationName,
      tripModel.destinationsById,
    );

    // Получаем тип для массива предложений.
    const type = formData.get('event-type');

    // Получаем массив выбранных предложений (offers), которые также нужно
    // преобразовать в id.
    const selectedOffers = formData.getAll('event-offers');
    // Получаем коллекцию Map всех предложаний по типу.
    const allOffers = tripModel.offersByType.get(type);

    // Создаём обратный Map для быстрого поиска по title (один раз O(n))
    const offersTitleToId = new Map();
    for (const [id, { title }] of allOffers) {
      offersTitleToId.set(title.toLowerCase(), id);
    }
    // Массив из выбранных значений.
    const selectedIdOffers = selectedOffers.map((offer) =>
      offersTitleToId.get(offer.toLowerCase()),
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
