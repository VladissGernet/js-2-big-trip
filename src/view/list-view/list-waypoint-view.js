import dayjs from 'dayjs';
import he from 'he';
import { calcTimeBetween, createElement } from '../../utils/index.js';

// Используем String.raw как тег для шаблонных строк,
// чтобы Prettier и редактор форматировали HTML внутри template literals корректно
const html = String.raw;

function createFilterFormTemplate({
  destinationData,
  offerData,
  basePrice,
  dateFrom,
  dateTo,
  isFavorite,
  type,
}) {
  // Безопасные данные
  const safeType = he.encode(type);
  const safeBasePrice = he.encode(String(basePrice));

  // Оставляю тут, Prettier неверно отспупы ставит.
  const isFavoriteItem = isFavorite ? 'event__favorite-btn--active' : '';

  /*
    TODO
    Сделать далее:

     <h4 class="visually-hidden">Offers:</h4>
     добавить данные из offers-mock

    Отфильтровать только выбранные предложения.

  */

  console.log(offerData);

  return html`
    <li class="trip-events__item">
      <div class="event">
        <time
          class="event__date"
          datetime=${dayjs(dateFrom).format('YYYY-MM-DD')}
          >${dayjs(dateFrom).format('MMM D').toUpperCase()}</time
        >
        <div class="event__type">
          <img
            class="event__type-icon"
            width="42"
            height="42"
            src="img/icons/${safeType}.png"
            alt="Event type icon"
          />
        </div>
        <h3 class="event__title">${destinationData.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time
              class="event__start-time"
              datetime=${dayjs(dateFrom).toISOString()}
              >${dayjs(dateFrom).format('HH:mm')}</time
            >
            &mdash;
            <time
              class="event__end-time"
              datetime=${dayjs(dateTo).toISOString()}
              >${dayjs(dateTo).format('HH:mm')}</time
            >
          </p>
          <p class="event__duration">${calcTimeBetween(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${safeBasePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          <li class="event__offer">
            <span class="event__offer-title">Add breakfast</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">50</span>
          </li>
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

export default class ListWaypointView {
  constructor({ listPoint, destinationData, offerData }) {
    this.listPoint = listPoint;
    this.destinationData = destinationData;
    this.offerData = offerData;
  }

  getTemplate() {
    return createFilterFormTemplate({
      ...this.listPoint,
      destinationData: this.destinationData,
      offerData: this.offerData,
    });
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
