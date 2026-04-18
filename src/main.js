import MainPresenter from './presenter/main-presenter.js';
import TripModel from './model/trip-model.js';
import FilterModel from './model/filter-model.js';

const tripModel = new TripModel();
const filterModel = new FilterModel();
const pageBody = document.querySelector('.page-body');
const mainPresenter = new MainPresenter({
  tripModel: tripModel,
  filterModel: filterModel,
  pageBody: pageBody,
});

mainPresenter.init();

/* TODO

Запретите возможность ввода в поле «Цена» любых значений, кроме числовых.

*/
