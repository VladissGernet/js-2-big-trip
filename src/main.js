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
pageMainPresenter.init();

/* TODO
  Добавить закрытие по нажатию ESC
*/

pageHeaderPresenter.eventAddBtn.element.addEventListener('click', (evt) => {
  evt.preventDefault();

  const newwWypointForm = new ListWaypointFormView({
    destinationData: model.destinationsById[model.listPoints[0].destination],
    listOffers: model.offersByType[model.listPoints[0].type],
    isEditForm: false,
    model: model,
  });
  render(
    newwWypointForm,
    pageMainPresenter.listView.element,
    RenderPosition.AFTERBEGIN
  );
});
