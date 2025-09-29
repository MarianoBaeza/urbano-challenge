import CreateUserRequest from '../models/user/CreateUserRequest';
import UpdateUserRequest from '../models/user/UpdateUserRequest';
import User from '../models/user/User';
import UserQuery from '../models/user/UserQuery';
import apiService from './ApiService';

class UserService {
  async save(createUserRequest: CreateUserRequest): Promise<void> {
    await apiService.post('/users', createUserRequest);
  }

  async findAll(userQuery: UserQuery): Promise<User[]> {
    const response = await apiService.get<User[]>('/users', {
      params: userQuery,
    });
    return response.data;
  }

  async findOne(id: string): Promise<User> {
    const response = await apiService.get<User>(`/users/${id}`);
    return response.data;
  }

  async update(
    id: string,
    updateUserRequest: UpdateUserRequest,
  ): Promise<void> {
    const payload = {
      firstName: updateUserRequest.firstName,
      lastName: updateUserRequest.lastName,
      username: updateUserRequest.username,
      role: updateUserRequest.role,
      isActive: updateUserRequest.isActive,
      password: updateUserRequest.password,
    };

    await apiService.put(`/users/${id}`, payload);
  }

  async delete(id: string): Promise<void> {
    await apiService.delete(`/users/${id}`);
  }
}

export default new UserService();
