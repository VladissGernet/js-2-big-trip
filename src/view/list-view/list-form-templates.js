import { html } from '../../utils/index.js';
import dayjs from 'dayjs';

const createOfferTemplate = ({ title, price }) => html` <div
  class="event__offer-selector"
>
  <input
    class="event__offer-checkbox  visually-hidden"
    id="event-offer-${title}"
    type="checkbox"
    name="event-offer-luggage"
  />
  <label class="event__offer-label" for="event-offer-${title}">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </label>
</div>`;

const createOffersTemplate = (data) => {
  const offers = Object.values(data || {});

  return offers.length > 0
    ? html` <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">
          Offers
        </h3>

        <div class="event__available-offers">
          ${offers.map(createOfferTemplate).join('')}
        </div>
      </section>`
    : '';
};

const createPicturesListTemplate = (dataList) => {
  const creatPictrueTemplate = ({ src, description }) => html`
    <img class="event__photo" src=${src} alt=${description} />
  `;

  return dataList?.length > 0
    ? html`<div class="event__photos-container">
        <div class="event__photos-tape">
          ${dataList.map(creatPictrueTemplate).join('')}
        </div>
      </div>`
    : '';
};

const createDestinationSectionTemplate = (data) =>
  data === null || data.description === ''
    ? ''
    : html` <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">
          Destination
        </h3>
        <p class="event__destination-description">${data.description}</p>

        ${createPicturesListTemplate(data.pictures)}
      </section>`;

const closeEditFormButton = (isEditForm) =>
  isEditForm
    ? html` <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`
    : '';

const createTypeList = (offers) => {
  const listItems = offers.reduce(
    (finalHTML, item) =>
      finalHTML +
      html`
        <div class="event__type-item">
          <input
            id="event-type-${item.type}-1"
            class="event__type-input  visually-hidden"
            type="radio"
            name="event-type"
            value="${item.type}"
          />
          <label
            class="event__type-label  event__type-label--${item.type}"
            for="event-type-${item.type}-1"
            >${item.type[0].toUpperCase() + item.type.slice(1)}</label
          >
        </div>
      `,
    ''
  );

  return html`
    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${listItems}
      </fieldset>
    </div>
  `;
};

const createListPointFormTemplate = ({
  listPoint = null,
  destinationData = null,
  listOffers = null,
  isEditForm,
  model,
}) => {
  /**@param {string} date - ISO 8601 дата */
  const formatDate = (date) =>
    !date ? '' : dayjs(date).format('DD/MM/YY HH:mm');

  const dateFrom = formatDate(listPoint?.dateFrom);
  const dateTo = formatDate(listPoint?.dateTo);
  const iconType = listPoint?.type || model?.offers[0]?.type || '';

  return html`
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label
              class="event__type  event__type-btn"
              for="event-type-toggle-1"
            >
              <span class="visually-hidden">Choose event type</span>
              <img
                class="event__type-icon"
                width="17"
                height="17"
                src="${iconType === '' ? '' : `img/icons/${iconType}.png`}"
                alt="Event type icon"
              />
            </label>
            <input
              class="event__type-toggle  visually-hidden"
              id="event-type-toggle-1"
              type="checkbox"
            />
            ${model?.offers ? createTypeList(model.offers) : ''}
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label
              class="event__label  event__type-output"
              for="event-destination-1"
            >
              ${iconType}
            </label>
            <input
              class="event__input  event__input--destination"
              id="event-destination-1"
              type="text"
              name="event-destination"
              value="${destinationData?.name || ''}"
              list="destination-list-1"
            />
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input
              class="event__input  event__input--time"
              id="event-start-time-1"
              type="text"
              name="event-start-time"
              value="${dateFrom}"
            />
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-1"
              type="text"
              name="event-end-time"
              value="${dateTo}"
            />
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input  event__input--price"
              id="event-price-1"
              type="text"
              name="event-price"
              value="${listPoint?.basePrice || ''}"
            />
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">
            Save
          </button>
          <button class="event__reset-btn" type="reset">
            ${isEditForm ? 'Delete' : 'Cancel'}
          </button>
          ${closeEditFormButton(isEditForm)}
        </header>
        <section class="event__details">
          ${createOffersTemplate(listOffers)}
          ${createDestinationSectionTemplate(destinationData)}
        </section>
      </form>
    </li>
  `;
};

export { createListPointFormTemplate };
