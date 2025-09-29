import { useEffect, useState } from 'react';
import { Loader, Plus, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import CoursesTable from '../components/courses/CoursesTable';
import Layout from '../components/layout';
import Modal from '../components/shared/Modal';
import useAuth from '../hooks/useAuth';
import CreateCourseRequest from '../models/course/CreateCourseRequest';
import { useAppStore } from '../store/appStore';
import courseService from '../services/CourseService';

export default function Courses() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [addCourseShow, setAddCourseShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { authenticatedUser } = useAuth();

  const courses = useAppStore((state) => state.courses ?? []);
  const fetchCourses = useAppStore((state) => state.fetchCourses);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        await fetchCourses();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const filteredCourses = courses
    .filter((c): c is NonNullable<typeof c> => !!c)
    .filter(
      (c) =>
        (c.name ?? '').toLowerCase().includes(name.toLowerCase()) &&
        (c.description ?? '').toLowerCase().includes(description.toLowerCase()),
    );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateCourseRequest>();

  const saveCourse = async (createCourseRequest: CreateCourseRequest) => {
    try {
      setLoading(true);
      await courseService.save(createCourseRequest);
      fetchCourses();
      setAddCourseShow(false);
      reset();
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5 bg-gray-500 p-5 lg:ml-72 mx-auto">
        Manage Courses
      </h1>

      <div className="p-5 lg:ml-72 mx-auto">
        <hr />

        {authenticatedUser?.role !== 'user' && (
          <button
            className="btn my-5 flex gap-2 w-full sm:w-auto justify-center"
            onClick={() => setAddCourseShow(true)}
          >
            <Plus /> Add Course
          </button>
        )}

        <div className="table-filter">
          <div className="flex flex-row gap-5">
            <input
              type="text"
              className="input w-1/2"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              className="input w-1/2"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <CoursesTable data={filteredCourses} isLoading={loading} />
      </div>

      <Modal show={addCourseShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Add Course</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setAddCourseShow(false);
              setError(null);
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(saveCourse)}
        >
          <input
            type="text"
            className="input"
            placeholder="Name"
            disabled={isSubmitting}
            required
            {...register('name')}
          />
          <input
            type="text"
            className="input"
            placeholder="Description"
            disabled={isSubmitting}
            required
            {...register('description')}
          />
          <button className="btn" disabled={isSubmitting} type="submit">
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
