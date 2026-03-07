import MainPresenter from './presenter/main-presenter.js';
import TripModel from './model/trip-model.js';

const model = new TripModel();
const pageBody = document.querySelector('.page-body');
const mainPresenter = new MainPresenter({ model: model, pageBody: pageBody });

mainPresenter.init();

// TODO
// После выполения задания удалить!
console.log('Открывает первую форму');

document.querySelector('.event__rollup-btn').click();
document.querySelector('.event__type-toggle').click();
