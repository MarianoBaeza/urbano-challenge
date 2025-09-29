import { create } from 'zustand';
import UserService from '../services/UserService';
import User from '../models/user/User';
import Course from '../models/course/Course';
import Content from '../models/content/Content';
import CourseService from '../services/CourseService';
import ContentService from '../services/ContentService';

interface AppState {
  courses: Course[];
  contents: Record<string, Content[]>;
  users: User[];

  fetchCourses: () => Promise<void>;
  fetchContents: (courseId: string) => Promise<void>;
  fetchUsers: (query?: Partial<User>) => Promise<void>;

  addContent: (courseId: string, content: Content) => void;

  updateUser: (userId: string, updatedUser: Partial<User>) => void;

  deleteContent: (courseId: string, contentId: string) => void;
  deleteCourse: (courseId: string) => void;
  deleteUser: (userId: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  courses: [],
  contents: {},
  users: [],

  fetchCourses: async () => {
    const data = await CourseService.findAll({});
    set({ courses: data });
  },

  fetchContents: async (courseId: string) => {
    const data = await ContentService.findAll(courseId, {});
    set((state) => ({
      contents: { ...state.contents, [courseId]: data },
    }));
  },

  fetchUsers: async (query?: Partial<User>) => {
    const users = await UserService.findAll({
      firstName: query?.firstName ?? '',
      lastName: query?.lastName ?? '',
      username: query?.username ?? '',
      role: query?.role ?? '',
    });
    set({ users });
  },

  addContent: (courseId, content) => {
    set((state) => ({
      contents: {
        ...state.contents,
        [courseId]: [...(state.contents[courseId] || []), content],
      },
    }));
  },

  deleteContent: (courseId, contentId) => {
    set((state) => ({
      contents: {
        ...state.contents,
        [courseId]: (state.contents[courseId] || []).filter(
          (c) => c.id !== contentId,
        ),
      },
    }));
  },

  deleteCourse: (courseId) => {
    set((state) => ({
      courses: state.courses.filter((c) => c.id !== courseId),
      contents: Object.fromEntries(
        Object.entries(state.contents).filter(([key]) => key !== courseId),
      ),
    }));
  },

  deleteUser: (userId) => {
    set((state) => ({
      users: state.users.filter((u) => u.id !== userId),
    }));
  },

  updateUser: (userId: string, updatedUser: Partial<User>) => {
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, ...updatedUser } : u,
      ),
    }));
  },
}));
