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

// console.log(pageHeaderPresenter.eventAddBtn);
// console.log(pageMainPresenter.listView);

/* TODO
  Остановился на добавлении формы нового item в список
  Нужны какие-то данные для того, чтобы прокинуть
*/

// console.log(model.listPoints[0]);
// console.log(model.destinationsById[model.listPoints[0].destination]);
// console.log(model.offersByType[model.listPoints[0].type]);

/* хочу переписать evet type list
  1. сделать шаблон и констатну для редера
  2. использовать первое значение массива констант для подстановки по умолчанию в случаен отсутсвия
    данных от listPoint шаблона createListWaypointFormTemplate

    3. сейчас остановился на прокидывании данные TripModel.offers в createTypeList

*/
const newwWypointForm = new ListWaypointFormView({
  listPoint: model.listPoints[0],
  // destinationData: model.destinationsById[model.listPoints[0].destination],
  // listOffers: model.offersByType[model.listPoints[0].type],
  isEditForm: false,
  model: model,
});
render(
  newwWypointForm,
  pageMainPresenter.listView.element,
  RenderPosition.AFTERBEGIN
);

pageHeaderPresenter.eventAddBtn.element.addEventListener('click', (evt) => {
  evt.preventDefault();

  // const newForm = new ListWaypointFormView();
  // render(newForm, pageMainPresenter.listView.element);
});
