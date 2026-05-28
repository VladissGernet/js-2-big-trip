import { ListPointFormView } from '../view/index.js';
import { remove } from '../framework/render.js';
import { createViewPointData } from '../utils/index.js';

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

    // Добавление обработчика закрытия по Esc.
    document.addEventListener('keydown', this.#handleEscKeyDown);
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
      });
    }
    return this.#pointFormComponent;
  }

  /**
   * Удаляет компонент презентера формы.
   * Для передачи callback в removeObserver необходима стрелочная функция.
   */
  destroy = () => {
    this.#filterModel.removeObserver(this.destroy);
    document.removeEventListener('keydown', this.#handleEscKeyDown);
    remove(this.#pointFormComponent);
    this.#pointFormComponent = null;
  };

  /** Удаляет существующую точку из списка. */
  async #removePoint() {
    this.#pointFormComponent.disableDeleteBtn();
    const selectedPointId = this.#pointData.id;

    try {
      await this.#tripModel.removePoint(selectedPointId);
      // Очищаем презентер точки.
      this.#pointPresenter.clear();
      this.#pointPresenter = null;

      // Удаление из коллекции Map презентеров точек.
      this.#removeFromPointPresenters(selectedPointId);

      this.destroy();

      // Если эта была последняя точка, то показываем сообщение о пустом списке.
      if (!this.#tripModel.listPoints.length) {
        this.#pageMainPresenter.renderEventsSection({
          isRenderNewPointForm: true,
        });
      }
    } catch (err) {
      this.#pointFormComponent.enableDeleteBtn();
      this.#pointFormComponent.shake();
      // prettier-ignore
      throw new Error('Can\'t remove point');
    }
  }

  /** Закрывает форму, не удаляет точку. */
  #closeForm() {
    this.#newPointPresenter.destroy();
    this.#newPointPresenter = null;

    const isListPointsEmpty = Boolean(!this.#tripModel.listPoints.length);
    if (isListPointsEmpty) {
      this.#pageMainPresenter.renderEventsSection();
    }
  }

  /** Удаление текущей Point из списка или закрытие создания новой точки. */
  #handleResetClick = async () => {
    // Если форма редактирования, то удаление точки.
    if (this.#isEditForm) {
      await this.#removePoint();
      // Обязательно для показа сообщения, в случае пустого списка.
      this.#pageMainPresenter.renderEventsSection({
        filter: this.#filterModel.filter,
      });
      return;
    }

    // Закрытие формы при отмене создания новой точки.
    this.#closeForm();
  };

  /** Закрытие по нажатию ESC. */
  #handleEscKeyDown = (evt) => {
    if (evt.key !== 'Escape') {
      return;
    }
    evt.preventDefault();

    // Если форма редактирования точки, то закрываем форму.
    if (this.#isEditForm) {
      this.#pointPresenter.fullReplaceFormToPoint();
      return;
    }

    // Если форма создания точки.
    this.#closeForm();
  };

  /** Добавление\сохранение данных формы. */
  #handleFormSubmit = async (evt) => {
    evt.preventDefault();
    this.#pointFormComponent.disableSaveBtn();
    const currentState = this.#pointFormComponent._state;
    const formData = new FormData(evt.target);
    const newData = PointFormPresenter.#preparePointData({
      formData,
      tripModel: this.#tripModel,
      currentState,
      pointData: this.#pointData,
    });

    try {
      if (this.#isEditForm) {
        await this.#tripModel.updatePoint(currentState.listPoint.id, newData);
        this.destroy();
      } else {
        // Обязательно удаляем поле id для отправки на сервер, который сам присвоит это поле.
        delete newData.id;
        await this.#tripModel.addPoint(newData);
        this.#newPointPresenter.destroy();
      }
      this.#pageMainPresenter.renderEventsSection({
        filter: this.#filterModel.filter,
      });
    } catch (error) {
      this.#pointFormComponent.enableSaveBtn();
      this.#pointFormComponent.shake();
      // prettier-ignore
      throw new Error('Can\'t update or add point');
    }
  };

  /** Подготавливает данные для обновления на клиенте. */
  static #preparePointData({
    formData,
    tripModel,
    currentState,
    pointData = null,
  }) {
    const pointId = pointData === null ? '' : pointData.id;
    const isFavorite = pointData === null ? false : pointData.isFavorite;

    // Получаем тип для массива предложений.
    const type = currentState.listPoint.type;
    const basePrice = Number(formData.get('event-price'));
    const newDestinationName = formData.get('event-destination');
    let newDestinationId = '';
    for (const [id, { name }] of tripModel.destinationsById) {
      if (newDestinationName === name) {
        newDestinationId = id;
        break;
      }
    }

    // Получаем массив выбранных предложений (offers), которые также нужно
    // преобразовать в id.
    const selectedOffers = formData.getAll('event-offers');
    // Получаем коллекцию Map всех предложений по типу.
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

    return {
      id: pointId,
      basePrice: basePrice,
      dateFrom: currentState.listPoint.dateFrom,
      dateTo: currentState.listPoint.dateTo,
      destination: newDestinationId,
      isFavorite,
      offers: new Set(selectedIdOffers),
      type,
    };
  }
}
