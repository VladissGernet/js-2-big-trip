import ApiService from './framework/api-service.js';
import { PointsURLs, Method } from './const.js';
import { adaptDataToServer } from './utils/index.js';

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

  async updatePoint(updatedData) {
    const response = await this._load({
      url: `points/${updatedData.id}`,
      method: Method.PUT,
      body: JSON.stringify(adaptDataToServer(updatedData)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  async addPoint(data) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(adaptDataToServer(data)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    const parseResponse = await ApiService.parseResponse(response);

    return parseResponse;
  }
}
