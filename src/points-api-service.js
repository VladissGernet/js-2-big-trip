import ApiService from './framework/api-service.js';
import { PointsURLs } from './const.js';

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({ url: PointsURLs.POINTS }).then(
      ApiService.parseResponse,
    );
  }

  get destinations() {
    return this._load({ url: PointsURLs.DESTINATIONS }).then(
      ApiService.parseResponse,
    );
  }

  get offers() {
    return this._load({ url: PointsURLs.OFFERS }).then(
      ApiService.parseResponse,
    );
  }

  updatePoint(updatedData) {
    // TODO, подготовить адаптер данных для отправки на сервер.
    // console.log(updatedData);
  }
}
