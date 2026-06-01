import Observable from '../framework/observable.js';
import { FilterType, FILTER_UPDATE_STATUS, LoadStatus } from '../const.js';
import FilterPresenter from '../presenter/filter-presenter.js';

export default class FilterModel extends Observable {
  #tripModel = null;
  #filter = FilterType.EVERYTHING;

  enabledFilterTypes = {
    [FilterType.EVERYTHING]: false,
    [FilterType.FUTURE]: false,
    [FilterType.PRESENT]: false,
    [FilterType.PAST]: false,
  };

  constructor(tripModel) {
    super();
    this.#tripModel = tripModel;

    this.#tripModel.addObserver(this.#handlePointsStatus);
  }

  get filter() {
    return this.#filter;
  }

  setFilter(status, filter) {
    this.#filter = filter;
    this._notify(filter, status);
  }

  #handlePointsStatus = (status) => {
    if (status === LoadStatus.REJECTED) {
      return;
    }

    const points = this.#tripModel.listPoints;
    const isEmptyList = !points.length;

    if (isEmptyList) {
      this.enabledFilterTypes[FilterType.EVERYTHING] = false;
      this.enabledFilterTypes[FilterType.FUTURE] = false;
      this.enabledFilterTypes[FilterType.PRESENT] = false;
      this.enabledFilterTypes[FilterType.PAST] = false;
      this._notify(FILTER_UPDATE_STATUS, isEmptyList);
      return;
    }
    this.enabledFilterTypes[FilterType.EVERYTHING] = true;

    const ifFutureStatus = !!FilterPresenter.filterList(
      FilterType.FUTURE,
      points,
    ).length;
    const isPresentStatus = !!FilterPresenter.filterList(
      FilterType.PRESENT,
      points,
    ).length;
    const isPastStatus = !!FilterPresenter.filterList(FilterType.PAST, points)
      .length;

    this.enabledFilterTypes[FilterType.FUTURE] = ifFutureStatus;
    this.enabledFilterTypes[FilterType.PRESENT] = isPresentStatus;
    this.enabledFilterTypes[FilterType.PAST] = isPastStatus;

    this._notify(FILTER_UPDATE_STATUS, isEmptyList);
  };
}
