import MainPresenter from './presenter/main-presenter.js';
import TripModel from './model/trip-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './points-api-service.js';
import { END_POINT, AUTHORIZATION } from './const.js';

// TODO cSpell не работает нормально, пропускает слова.
const tripModel = new TripModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION),
});
const filterModel = new FilterModel();
const pageBody = document.querySelector('.page-body');
const mainPresenter = new MainPresenter({
  tripModel: tripModel,
  filterModel: filterModel,
  pageBody: pageBody,
});

mainPresenter.init();
