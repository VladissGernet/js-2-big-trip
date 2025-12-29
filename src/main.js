import PageHeaderPresenter from './presenter/page-header-presenter.js';
import PageMainPresenter from './presenter/page-main-presenter.js';
import { ListWaypointFormView } from './view/index.js';
import { render } from './framework/render.js';

const pageBody = document.querySelector('.page-body');

const pageHeaderPresenter = new PageHeaderPresenter({
  container: pageBody,
});
const pageMainPresenter = new PageMainPresenter(pageBody);

// Редер списка на основе данных с сервера.
pageHeaderPresenter.init();
pageMainPresenter.init();

// console.log(pageHeaderPresenter.eventAddBtn);
// console.log(pageMainPresenter.listView);

/* TODO
  Остановился на добавлении формы нового item в список
  Нужны какие-то данные для того, чтобы прокинуть
*/

pageHeaderPresenter.eventAddBtn.element.addEventListener('click', (evt) => {
  evt.preventDefault();

  const newForm = new ListWaypointFormView();
  render(newForm, pageMainPresenter.listView.element);
});
