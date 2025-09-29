import Stats from '../models/stats/Stats';
import apiService from './ApiService';

class StatsService {
  async getStats(): Promise<Stats> {
    const response = await apiService.get<Stats>('/stats');
    return response.data;
  }
}

export default new StatsService();
