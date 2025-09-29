import { useEffect, useState } from 'react';
import { Loader, Plus, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import ContentsTable from '../components/content/ContentsTable';
import Layout from '../components/layout';
import Modal from '../components/shared/Modal';
import useAuth from '../hooks/useAuth';
import CreateContentRequest from '../models/content/CreateContentRequest';
import { useAppStore } from '../store/appStore';
import CourseService from '../services/CourseService';
import ContentService from '../services/ContentService';

export default function Contents() {
  const { id } = useParams<{ id: string }>();
  const { authenticatedUser } = useAuth();

  if (!id)
    return <div className="h-full flex justify-center items-center">No ID</div>;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [addContentShow, setAddContentShow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContents = async () => {
      try {
        await fetchContents(id);
      } catch (err) {
        console.error(err);
      }
    };
    loadContents();
  }, []);

  const contents = useAppStore((state) => state.contents[id]);
  const fetchContents = useAppStore((state) => state.fetchContents);
  const addContent = useAppStore((state) => state.addContent);

  const filteredContents = contents
    ? contents.filter(
        (c) =>
          (c.name ?? '').toLowerCase().includes(name.toLowerCase()) &&
          (c.description ?? '')
            .toLowerCase()
            .includes(description.toLowerCase()),
      )
    : [];

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateContentRequest>();

  const saveContent = async (newContent: CreateContentRequest) => {
    if (!id) return;

    try {
      const savedContent = await ContentService.save(id, newContent);
      addContent(id, savedContent);
      setAddContentShow(false);
      reset();
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5 bg-gray-500 p-5 lg:ml-72 mx-auto">
        Contents
      </h1>

      <div className="p-5 lg:ml-72 mx-auto">
        <hr />
        {authenticatedUser?.role !== 'user' && (
          <button
            className="btn my-5 flex gap-2 w-full sm:w-auto justify-center"
            onClick={() => setAddContentShow(true)}
          >
            <Plus /> Add Content
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
        <ContentsTable
          data={filteredContents}
          isLoading={contents === undefined}
          courseId={id}
        />
      </div>

      <Modal show={addContentShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Add Content</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setAddContentShow(false);
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(saveContent)}
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
