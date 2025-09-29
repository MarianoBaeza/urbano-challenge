import { useEffect, useState } from 'react';
import { Loader, Plus, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import Layout from '../components/layout';
import Modal from '../components/shared/Modal';
import UsersTable from '../components/users/UsersTable';
import useAuth from '../hooks/useAuth';
import CreateUserRequest from '../models/user/CreateUserRequest';
import userService from '../services/UserService';
import { useAppStore } from '../store/appStore';

export default function Users() {
  const { authenticatedUser } = useAuth();
  const [addUserShow, setAddUserShow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const users = useAppStore((state) => state.users);
  const fetchUsers = useAppStore((state) => state.fetchUsers);

  const [filters, setFilters] = useState({
    firstName: '',
    lastName: '',
    username: '',
    role: '',
  });

  useEffect(() => {
    fetchUsers(filters);
  }, [filters]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateUserRequest>();

  const saveUser = async (createUserRequest: CreateUserRequest) => {
    try {
      await userService.save(createUserRequest);
      fetchUsers();
      setAddUserShow(false);
      reset();
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const filteredUsers = users.filter((u) => u.id !== authenticatedUser?.id);

  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5 bg-gray-500 p-5 lg:ml-72 mx-auto">
        Manage Users
      </h1>
      <hr />
      <div className="p-5 lg:ml-72 mx-auto">
        <button
          className="btn my-5 flex gap-2 w-full sm:w-auto justify-center"
          onClick={() => setAddUserShow(true)}
        >
          <Plus /> Add User
        </button>

        <div className="table-filter mt-2">
          <div className="flex flex-row gap-5">
            <input
              type="text"
              className="input w-1/2"
              placeholder="First Name"
              value={filters.firstName}
              onChange={(e) =>
                setFilters({ ...filters, firstName: e.target.value })
              }
            />
            <input
              type="text"
              className="input w-1/2"
              placeholder="Last Name"
              value={filters.lastName}
              onChange={(e) =>
                setFilters({ ...filters, lastName: e.target.value })
              }
            />
          </div>
          <div className="flex flex-row gap-5">
            <input
              type="text"
              className="input w-1/2"
              placeholder="Username"
              value={filters.username}
              onChange={(e) =>
                setFilters({ ...filters, username: e.target.value })
              }
            />
            <select
              className="input w-1/2"
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            >
              <option value="">All</option>
              <option value="user">User</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <UsersTable data={filteredUsers} isLoading={false} />
      </div>

      <Modal show={addUserShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Add User</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setError(null);
              setAddUserShow(false);
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(saveUser)}
        >
          <div className="flex flex-col gap-5 sm:flex-row">
            <input
              type="text"
              className="input sm:w-1/2"
              placeholder="First Name"
              required
              disabled={isSubmitting}
              {...register('firstName')}
            />
            <input
              type="text"
              className="input sm:w-1/2"
              placeholder="Last Name"
              required
              disabled={isSubmitting}
              {...register('lastName')}
            />
          </div>
          <input
            type="text"
            className="input"
            placeholder="Username"
            required
            disabled={isSubmitting}
            {...register('username')}
          />
          <input
            type="password"
            className="input"
            placeholder="Password (min 6 characters)"
            required
            disabled={isSubmitting}
            {...register('password')}
          />
          <select
            className="input"
            required
            {...register('role')}
            disabled={isSubmitting}
          >
            <option value="user">User</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              'Save'
            )}
          </button>
          {error && (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          )}
        </form>
      </Modal>
    </Layout>
  );
}
