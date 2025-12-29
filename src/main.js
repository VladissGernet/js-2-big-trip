import PageHeaderPresenter from './presenter/page-header-presenter.js';
import SortPresenter from './presenter/sort-presenter.js';
import ListPresenter from './presenter/list-presenter.js';
import TripModel from './model/trip-model.js';

import { TRIP_SORTS } from './const.js';

const pageBody = document.querySelector('.page-body');

// const tripControls = document.querySelector('.trip-controls');

// const tripEvents = document.querySelector('.trip-events');

// Инициализация презентеров.
const pageHeaderPresenter = new PageHeaderPresenter({
  container: pageBody,
});

// const sortPresenter = new SortPresenter({
//   container: tripEvents,
//   sorts: TRIP_SORTS,
// });
// const listPresenter = new ListPresenter({
//   container: tripEvents,
//   tripModel: new TripModel(),
// });

pageHeaderPresenter.init();

// sortPresenter.init();
// listPresenter.init();

/*

    <main class="page-body__page-main page-main">
      <div class="page-body__container">
        <section class="trip-events">
          <h2 class="visually-hidden">Trip events</h2>

          <!-- Сортировка -->

          <!-- Контент -->
        </section>
      </div>
    </main> */
