import PageHeaderPresenter from './presenter/page-header-presenter.js';
import PageMainPresenter from './presenter/page-main-presenter.js';
import NewEventBtnPresenter from './presenter/new-event-btn-presenter.js';

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
pageMainPresenter.init(pageHeaderPresenter.filterControls);

// Создание формы добавления новой путевой точки.
const newEventBtnPresenter = new NewEventBtnPresenter({
  btnElement: pageHeaderPresenter.eventAddBtn.element,
  model: model,
  tripEventsEmpty: pageMainPresenter.tripEventsEmpty,
  listView: pageMainPresenter.listView,
  filterControls: pageHeaderPresenter.filterControls,
  tripEvents: pageMainPresenter.tripEvents,
});
newEventBtnPresenter.init();
