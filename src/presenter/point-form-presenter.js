import { ListPointFormView, TripEventsEmptyView } from '../view/index.js';
import PointPresenter from './point-presenter.js';
import { render, remove } from '../framework/render.js';

/** Конфигурация презентера формы путевой точки.
 * @typedef {Object} PointFormConfig
 * @property {Object} pointData - Данные точки маршрута.
 * @property {Object} tripModel - Модель данных поездки.
 * @property {Class} pointPresenter - Презентер точки.
 * @property {Class} newEventBtnPresenter - Презентер создания новой точки.
 * @property {HTMLElement} tripEventsElement - Элемент с сортировкой и списком точек.
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
  #tripEventsElement = null;
  #isEditForm = null;
  // Данные существующей точки.
  #pointData = null;
  #pointPresenter = null;
  #handleRolldownClick = null;
  #removeFromPointPresenters = null;
  // Данные новой точки.
  #newEventBtnPresenter = null;

  #pointFormComponent = null;

  /** @param {PointFormConfig} config - Конфигурация презентера */
  constructor({
    tripModel,
    tripEventsElement,
    isEditForm,
    pointData,
    pointPresenter,
    onRolldownClick,
    removeFromPointPresenters,

    newEventBtnPresenter,
  }) {
    // Общие данные.
    this.#tripModel = tripModel;
    this.#tripEventsElement = tripEventsElement;
    this.#isEditForm = isEditForm;

    // Данные существующей точки.
    this.#pointData = pointData;
    this.#pointPresenter = pointPresenter;
    this.#handleRolldownClick = onRolldownClick;
    this.#removeFromPointPresenters = removeFromPointPresenters;

    // Данные новой точки.
    this.#newEventBtnPresenter = newEventBtnPresenter;

    // Добавление обработчкиа закрытия по Esc.
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  /** Закрытие по нажатию ESC. */
  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      document.removeEventListener('keydown', this.#escKeyDownHandler);

      if (!this.#isEditForm) {
        // Если форма создания новой точки, то просто все убираем.
        this.#destroy();
        return;
      }
      // Если форма редактирования точки, то закрываем форму.

      this.#pointPresenter.fullReplaceFormToPoint();
      this.removeComponent();
    }
  };

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

  #destroy() {
    this.removeComponent();

    if (!this.#isEditForm) {
      // Если создание новой точки.
      this.#newEventBtnPresenter.destroy();
    } else if (this.#isEditForm) {
      // Если редактирование точки, то идет удаление.
      // Очищаем презентер точки.
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.#pointPresenter.clear();
      this.#pointPresenter = null;

      // Удаление из данных модели.
      const selectedPointId = this.#pointData.id;
      this.#tripModel.removePoint(selectedPointId);

      // Удаление из коллекции Map презентеров точек.
      this.#removeFromPointPresenters(this.#pointData.id);
    }
  }

  /** Удаление текущей Point из списка. */
  #handleDeleteClick = () => {
    this.#destroy();

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

    // это убираю
    // Если список пустой, то возвращает сообщение о предложении создания
    // новой путевой точки.
    // if (this.#tripModel.listPoints.length === 0) {
    //   this.#tripEventsElement.innerHTML =
    //     '<h2 class="visually-hidden">Trip events</h2>';
    //   render(new TripEventsEmptyView(), this.#tripEventsElement);
    // }
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
    const destination = formData.get('event-destination');
    const destinationId = destination
      ? tripModel.transformDestinationNameToId(destination)
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
      'base_price:': price,
      'date_from:': currentState.listPoint.dateFrom,
      'date_to:': currentState.listPoint.dateTo,
      destination: destinationId,
      'is_favorite:': isFavorite,
      offers: selectedIdOffers,
      'type:': type,
    };

    return data;
  }
}
