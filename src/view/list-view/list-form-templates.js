import { html } from '../../utils/index.js';

const createOfferTemplate = ({ title, price, isSelected }) => {
  const id = title.toLowerCase() + price;

  return html`<div class="event__offer-selector">
    <input
      class="event__offer-checkbox visually-hidden"
      id="${id}"
      type="checkbox"
      name="event-offers"
      value="${title.toLowerCase()}"
      ${isSelected ? 'checked' : ''}
    />
    <label class="event__offer-label" for="${id}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>`;
};

const createOffersTemplate = (offers) => {
  if (!offers?.length) {
    return '';
  }

  const result = offers.map((item) => createOfferTemplate(item)).join('');
  return html` <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">${result}</div>
  </section>`;
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

const closeEditFormBtn = (isEditForm) =>
  isEditForm
    ? html` <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`
    : '';

const createTypeList = (offers, iconType) => {
  const listItems = offers.reduce(
    (finalHTML, item) =>
      finalHTML +
      html`
        <div class="event__type-item">
          <input
            id="event-type-${item.type}-1"
            class="event__type-input visually-hidden"
            type="radio"
            name="event-type"
            value="${item.type}"
            ${iconType === item.type ? 'checked' : ''}
          />
          <label
            class="event__type-label event__type-label--${item.type}"
            for="event-type-${item.type}-1"
            >${item.type[0].toUpperCase() + item.type.slice(1)}</label
          >
        </div>
      `,
    '',
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

const isModelForTypes = (tripModel, iconType) =>
  tripModel?.offersReadOnly
    ? createTypeList(tripModel.offersReadOnly, iconType)
    : '';

const createDatalist = (cities) =>
  html` <datalist id="destination-list-1">
    ${cities.map((city) => `<option value="${city}"></option>`).join('')}
  </datalist>`;

const createListPointFormTemplate = ({
  pointData = {},
  isEditForm,
  tripModel,
}) => {
  const {
    listPoint = null,
    destinationData = null,
    offerData = tripModel.offersReadOnly[0].offers,
  } = pointData;

  const iconType = listPoint?.type || tripModel?.offersReadOnly[0]?.type || '';
  const destinationId = tripModel.transformDestinationNameToId(
    destinationData.name,
  );

  return html`
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label
              class="event__type event__type-btn"
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
              class="event__type-toggle visually-hidden"
              id="event-type-toggle-1"
              type="checkbox"
            />
            ${isModelForTypes(tripModel, iconType)}
          </div>

          <div class="event__field-group event__field-group--destination">
            <label
              class="event__label event__type-output"
              for="event-destination-1"
            >
              ${iconType}
            </label>
            <input
              class="event__input event__input--destination"
              id="event-destination-1"
              type="text"
              name="event-destination"
              value="${destinationData?.name || ''}"
              list="destination-list-1"
              data-destination-id="${destinationId}"
            />
            ${createDatalist(tripModel.cities)}
          </div>

          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input
              class="event__input event__input--time"
              id="event-start-time-1"
              type="text"
              name="event-start-time"
            />
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input
              class="event__input event__input--time"
              id="event-end-time-1"
              type="text"
              name="event-end-time"
            />
          </div>

          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input event__input--price"
              id="event-price-1"
              type="text"
              name="event-price"
              value="${listPoint?.basePrice || ''}"
            />
          </div>

          <button class="event__save-btn btn btn--blue" type="submit">
            Save
          </button>
          <button class="event__reset-btn" type="reset">
            ${isEditForm ? 'Delete' : 'Cancel'}
          </button>
          ${closeEditFormBtn(isEditForm)}
        </header>
        <section class="event__details">
          ${createOffersTemplate(offerData)}
          ${createDestinationSectionTemplate(destinationData)}
        </section>
      </form>
    </li>
  `;
};

export { createListPointFormTemplate };
