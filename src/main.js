import MainPresenter from './presenter/main-presenter.js';
import TripModel from './model/trip-model.js';

const model = new TripModel();
const pageBody = document.querySelector('.page-body');

new MainPresenter({ model: model, pageBody: pageBody }).init();

/* TODO
 * заменить все .remove() на remove из framework

 * разбить в перезентерах все рендеры на отдельные методы #renderSomething

 * заменить хранение данных с Object на Map set

 * Посомотреть реализацию приватных методов и еще связываение с данными:
  #renderTask(task) {
    const taskPresenter = new TaskPresenter({
      taskListContainer: this.#taskListComponent.element,
    });
    taskPresenter.init(task);
    this.#taskPresenters.set(task.id, taskPresenter);
  }

  * Реализовать возможность создания только одной формы на страницы с помощью "режима"
  const Mode = {
    DEFAULT: 'DEFAULT',
    EDITING: 'DEITING',
  }
 */
