import ListView from '../view/list-view/list-view.js';
import ListWaypointView from '../view/list-view/list-waypoint-view.js';
import ListCreationFormView from '../view/list-view/list-creation-form-view.js';

import { render } from '../utils/render.js';

export default class ListPresenter {
  list = new ListView();
  listCreationFormView = new ListCreationFormView();

  constructor({ container, tripModel }) {
    this.container = container;
    this.tripModel = tripModel;
  }

  init() {
    this.listPoints = [...this.tripModel.getPoints()];
    // Преобразовываю данные для оптимизированного поиска.
    this.listDestinations = [...this.tripModel.getDestinations()].reduce(
      (acc, { id, ...rest }) => ({
        ...acc,
        [id]: rest,
      }),
      {}
    );

    render(this.list, this.container);
    render(this.listCreationFormView, this.list.getElement());

    // Создание динамического списка.
    for (let i = 0; i < this.listPoints.length; i++) {
      // Получаю данные из оптимизированного объекта.
      const destinationData =
        this.listDestinations[this.listPoints[i].destination];

      const newWayPoint = new ListWaypointView({
        listPoint: this.listPoints[i],
        destinationData: destinationData,
      });
      render(newWayPoint, this.list.getElement());
    }
  }
}
