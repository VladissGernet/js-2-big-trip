import AbstractView from '../../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import he from 'he';
import { calcTimeBetween, html } from '../../utils/index.js';

function createPointOffersTemplate(offerData) {
  if (offerData.length === 0) {
    return '';
  }
  return offerData
    .map(({ title, price, isSelected }) => {
      if (!isSelected) {
        return '';
      }

      return html`
        <li class="event__offer">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </li>
      `;
    })
    .join('');
}

function createPointTemplate({
  destinationData,
  offerData,
  basePrice,
  dateFrom,
  dateTo,
  isFavorite,
  type,
}) {
  // Оставляю тут, Prettier неверно отспупы ставит.
  const isFavoriteItem = isFavorite ? 'event__favorite-btn--active' : '';
  const encodedType = he.decode(type);

  return html`
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime=${dateFrom.format('YYYY-MM-DD')}
          >${dateFrom.format('MMM D').toUpperCase()}</time
        >
        <div class="event__type">
          <img
            class="event__type-icon"
            width="42"
            height="42"
            src="img/icons/${encodedType}.png"
            alt="Event type icon"
          />
        </div>
        <h3 class="event__title">
          ${encodedType}
          ${destinationData ? he.encode(destinationData?.name) : ''}
        </h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime=${dateFrom.toISOString()}
              >${dateFrom.format('HH:mm')}</time
            >
            &mdash;
            <time class="event__end-time" datetime=${dateTo.toISOString()}
              >${dateTo.format('HH:mm')}</time
            >
          </p>
          <p class="event__duration">${calcTimeBetween(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value"
            >${he.encode(String(basePrice))}</span
          >
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createPointOffersTemplate(offerData)}
        </ul>
        <button class="event__favorite-btn ${isFavoriteItem}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg
            class="event__favorite-icon"
            width="28"
            height="28"
            viewBox="0 0 28 28"
          >
            <path
              d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"
            />
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
}

export default class ListPointView extends AbstractView {
  #listPoint = null;
  #destinationData = null;
  #listOffers = null;
  #handleRollupCLick = null;
  #handleFavoriteClick = null;

  constructor({
    listPoint,
    destinationData,
    offerData,
    onRollupClick,
    onFavoriteClick,
  }) {
    super();
    this.#listPoint = listPoint;
    this.#destinationData = destinationData;
    this.#listOffers = offerData;
    this.#handleRollupCLick = onRollupClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.#addEventListeners();
  }

  get template() {
    const listPointData = structuredClone(this.#listPoint);
    const dateFrom = dayjs(listPointData.dateFrom);
    const dateTo = dayjs(listPointData.dateTo);
    listPointData.dateFrom = dateFrom;
    listPointData.dateTo = dateTo;

    return createPointTemplate({
      ...listPointData,
      destinationData: this.#destinationData,
      offerData: this.#listOffers,
    });
  }

  removeElement() {
    super.removeElement();
    this.#removeEventListeners();
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupCLick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };

  #addEventListeners() {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);
    this.element
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  #removeEventListeners() {
    this.element
      .querySelector('.event__rollup-btn')
      .removeEventListener('click', this.#rollupClickHandler);
    this.element
      .querySelector('.event__favorite-btn')
      .removeEventListener('click', this.#favoriteClickHandler);
  }
}
