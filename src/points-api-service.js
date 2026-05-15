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
    // TODO, остановился здесь, подготовить адаптер данных для отправки на сервер.

    const adaptToServer = (data) => {
      const serverData = {};
      for (const [key, value] of Object.entries(data)) {
        const snakeCaseKey = key
          .replace(/([a-z])([A-Z])/g, '$1_$2')
          .toLowerCase();
        serverData[snakeCaseKey] = value;
      }
      serverData.offers = Array.from(serverData.offers);
      return serverData;
    };
    console.log(adaptToServer(updatedData));
  }
}
