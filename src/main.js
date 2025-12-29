import PageHeaderPresenter from './presenter/page-header-presenter.js';
import PageMainPresenter from './presenter/page-main-presenter.js';

const pageBody = document.querySelector('.page-body');

const pageHeaderPresenter = new PageHeaderPresenter({
  container: pageBody,
});
const pageMainPresenter = new PageMainPresenter(pageBody);

// Редер списка на основе данных с сервера.
pageHeaderPresenter.init();
pageMainPresenter.init();

console.log(pageMainPresenter.listView);
console.log(pageHeaderPresenter.eventAddBtn);

// this.eventAddBtn.element.addEventListener('click', (evt) => {
//   evt.preventDefault();
//   console.log('click');
// });
