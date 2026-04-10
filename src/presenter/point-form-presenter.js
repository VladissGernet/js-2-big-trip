import { ListPointFormView, TripEventsEmptyView } from '../view/index.js';
import { render, remove } from '../framework/render.js';

/** Конфигурация презентера формы путевой точки.
 * @typedef {Object} PointFormConfig
 * @property {Object} pointData - Данные точки маршрута.
 * @property {Object} viewPointData - Данные точки маршрута для view.
 * @property {Object} tripModel - Модель данных поездки.
 * @property {Class} pointPresenter - Презентер точки.
 * @property {HTMLElement} tripEventsElement - Элемент с сортировкой и списком точек.
 *
 * @property {function(): void} onRolldownClick - Функция‑callback (обработчик клика), которая
 * закрывает форму.
 * @property {function(): void} removeFromPointPresenters - Функция‑callback, удаляющая
 * из коллекции Map в listPresenter.
 */

export default class PointFormPresenter {
  #pointData = null;
  #viewPointData = null;
  #tripModel = null;
  #pointPresenter = null;
  #tripEventsElement = null;

  #pointFormComponent = null;

  #handleRolldownClick = null;
  #removeFromPointPresenters = null;

  /** @param {PointFormConfig} config - Конфигурация презентера */
  constructor({
    pointData,
    viewPointData,
    tripModel,
    pointPresenter,
    tripEventsElement,
    onRolldownClick,
    removeFromPointPresenters,
  }) {
    this.#pointData = pointData;
    this.#viewPointData = viewPointData;
    this.#tripModel = tripModel;
    this.#pointPresenter = pointPresenter;
    this.#tripEventsElement = tripEventsElement;
    this.#handleRolldownClick = onRolldownClick;
    this.#removeFromPointPresenters = removeFromPointPresenters;
  }

  /** Добавление\сохранение данных формы. */
  #handleFormSubmit = (evt) => {
    const currentState = this.#pointFormComponent._state;
    const formData = new FormData(evt.target);

    // TODO
    // 3. Реализовать функцию обновления данных в моделе tripModel.
    //    Возможно имеющийся публичный метод подойдет:
    //    this.#tripModel.updatePoint(pointId, updatedData)
    console.log(
      PointFormPresenter.#preparePointData({
        formData,
        tripModel: this.#tripModel,
        currentState,
        pointData: this.#pointData,
      }),
    );
  };

  /** Удаление текущей Point из списка. */
  #handleDeleteClick = () => {
    this.#pointPresenter.clear();
    this.removeComponent();

    // Удаление из данных модели.
    const selectedPointId = this.#pointData.id;
    this.#tripModel.removePoint(selectedPointId);

    // Удаление из коллекции презентеров точек.
    this.#removeFromPointPresenters(this.#pointData.id);

    //Если список пустой, то возвращает сообщение о предложении создания
    // новой путевой точки.
    if (this.#tripModel.listPoints.length === 0) {
      this.#tripEventsElement.innerHTML =
        '<h2 class="visually-hidden">Trip events</h2>';
      render(new TripEventsEmptyView(), this.#tripEventsElement);
    }
  };

  get component() {
    if (!this.#pointFormComponent) {
      this.#pointFormComponent = new ListPointFormView({
        viewPointData: this.#viewPointData,
        isEditForm: true,
        tripModel: this.#tripModel,
        onRolldownClick: this.#handleRolldownClick,
        onFormSubmit: this.#handleFormSubmit,
        onResetClick: this.#handleDeleteClick,
      });
    }
    return this.#pointFormComponent;
  }

  removeComponent() {
    remove(this.#pointFormComponent);
    this.#pointFormComponent = null;
  }

  /** Подготавливает данные для отправки. */
  static #preparePointData({ formData, tripModel, currentState, pointData }) {
    let data = {};

    // Получаем стоимость.
    const price = formData.get('event-price');

    // Преобразовывает название пункта назначения в соответсвующий ему id.
    const destinationId = tripModel.transformDestinationNameToId(
      formData.get('event-destination'),
    );

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
      'base_price:': price,
      'date_from:': currentState.listPoint.dateFrom,
      'date_to:': currentState.listPoint.dateTo,
      destination: destinationId,
      'is_favorite:': pointData.isFavorite,
      offers: selectedIdOffers,
      'type:': type,
    };

    return data;
  }
}
