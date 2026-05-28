import { html } from '../../utils/index.js';
import { DEFAULT_BASE_PRICE } from '../../const.js';

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
  return html`<section class="event__section event__section--offers">
    <h3 class="event__section-title event__section-title--offers">Offers</h3>
    <div class="event__available-offers">${result}</div>
  </section>`;
};

const createPicturesListTemplate = (dataList) => {
  const createPictureTemplate = ({ src, description }) => html`
    <img class="event__photo" src=${src} alt=${description} />
  `;

  return dataList?.length > 0
    ? html`<div class="event__photos-container">
        <div class="event__photos-tape">
          ${dataList.map(createPictureTemplate).join('')}
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
  let listItems = '';
  // TODO, первый элементом должен быть почему-то flight. "expected 'taxi' to include 'flight'"
  // в ".event__type-output"

  for (const offerName of offers) {
    listItems += html`<div class="event__type-item">
      <input
        id="event-type-${offerName}-1"
        class="event__type-input visually-hidden"
        type="radio"
        name="event-type"
        value="${offerName}"
        ${iconType === offerName ? 'checked' : ''}
      />
      <label
        class="event__type-label event__type-label--${offerName}"
        for="event-type-${offerName}-1"
        >${offerName[0].toUpperCase() + offerName.slice(1)}</label
      >
    </div>`;
  }

  return html`
    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${listItems}
      </fieldset>
    </div>
  `;
};

const createEventDetails = (offerData, destinationData) => {
  const offersTemplate = createOffersTemplate(offerData);
  const destinationTemplate = createDestinationSectionTemplate(destinationData);
  const isEmptyDetails = !offersTemplate && !destinationTemplate;

  return isEmptyDetails
    ? ''
    : html`<section class="event__details">
        ${offersTemplate}${destinationTemplate}
      </section>`;
};

const createDatalist = (cities) =>
  html`<datalist id="destination-list-1">
    ${cities.map((city) => `<option value="${city}"></option>`).join('')}
  </datalist>`;

const createListPointFormTemplate = ({
  viewPointData = {},
  isEditForm,
  tripModel,
}) => {
  const {
    listPoint = null,
    destinationData = null,
    offerData = null,
  } = viewPointData;

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
                src="img/icons/${`${listPoint.type}`}.png"
                alt="Event type icon"
              />
            </label>
            <input
              class="event__type-toggle visually-hidden"
              id="event-type-toggle-1"
              type="checkbox"
            />
            ${createTypeList(tripModel.offersByType.keys(), listPoint.type)}
          </div>

          <div class="event__field-group event__field-group--destination">
            <label
              class="event__label event__type-output"
              for="event-destination-1"
            >
              ${listPoint.type}
            </label>
            <input
              class="event__input event__input--destination"
              id="event-destination-1"
              type="text"
              name="event-destination"
              value="${destinationData?.name || ''}"
              list="destination-list-1"
              required
            />
            ${createDatalist(tripModel.cities)}
          </div>

          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time">From</label>
            <input
              class="event__input event__input--time"
              id="event-start-time"
              type="text"
              name="event-start-time"
            />
            &mdash;
            <label class="visually-hidden" for="event-end-time">To</label>
            <input
              class="event__input event__input--time"
              id="event-end-time"
              type="text"
              name="event-end-time"
            />
          </div>

          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input event__input--price"
              id="event-price"
              type="text"
              inputmode="numeric"
              name="event-price"
              value="${listPoint?.basePrice || DEFAULT_BASE_PRICE}"
              required
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
        ${createEventDetails(offerData, destinationData)}
      </form>
    </li>
  `;
};

export { createListPointFormTemplate };
