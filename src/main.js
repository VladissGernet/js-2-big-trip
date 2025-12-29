import PageHeaderPresenter from './presenter/page-header-presenter.js';
import PageMainPresenter from './presenter/page-main-presenter.js';

const pageBody = document.querySelector('.page-body');

const pageHeaderPresenter = new PageHeaderPresenter({
  container: pageBody,
});
const pageMainPresenter = new PageMainPresenter(pageBody);

pageHeaderPresenter.init();
pageMainPresenter.init();

console.log(pageMainPresenter.listView);
