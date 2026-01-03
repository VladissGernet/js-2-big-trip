import PageHeaderPresenter from './presenter/page-header-presenter.js';
import PageMainPresenter from './presenter/page-main-presenter.js';
import { ListWaypointFormView } from './view/index.js';
import { render, RenderPosition } from './framework/render.js';

import TripModel from './model/trip-model.js';

const model = new TripModel();
const pageBody = document.querySelector('.page-body');

const pageHeaderPresenter = new PageHeaderPresenter({
  container: pageBody,
});
const pageMainPresenter = new PageMainPresenter({
  container: pageBody,
  model: model,
});

// Редер списка на основе данных с сервера.
pageHeaderPresenter.init();
pageMainPresenter.init(pageHeaderPresenter.tripControls.filtersContainer);

// Создание формы добавления новой путевой точки.
pageHeaderPresenter.eventAddBtn.element.addEventListener('click', (evt) => {
  evt.preventDefault();
  const newWaypointForm = new ListWaypointFormView({
    destinationData: model.destinationsById[model.listPoints[0].destination],
    listOffers: model.offersByType[model.listPoints[0].type],
    isEditForm: false,
    model: model,
  });

  const resetButton =
    newWaypointForm.element.querySelector('.event__reset-btn');

  let escKeyDownHandler = null;
  let resetButtonHandler = null;

  const closeForm = () => {
    document.removeEventListener('keydown', escKeyDownHandler);
    resetButton.removeEventListener('click', resetButtonHandler);
    newWaypointForm.element.remove();
    pageHeaderPresenter.eventAddBtn.element.disabled = false;
  };

  escKeyDownHandler = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeForm();
    }
  };

  resetButtonHandler = (e) => {
    e.preventDefault();
    closeForm();
  };

  pageHeaderPresenter.eventAddBtn.element.disabled = true;

  resetButton.addEventListener('click', resetButtonHandler);

  render(
    newWaypointForm,
    pageMainPresenter.listView.element,
    RenderPosition.AFTERBEGIN
  );

  document.addEventListener('keydown', escKeyDownHandler);
});
