import Observable from '../framework/observable.js';
import { FilterType } from '../const.js';

export default class FilterModel extends Observable {
  // TODO
  // Реализовать полную перерисовку спаиска.

  // #filter = FilterType.EVERYTHING;
  // #filter = FilterType.PAST;
  // #filter = FilterType.FUTURE;
  #filter = FilterType.PRESENT;

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, filter) {
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}
