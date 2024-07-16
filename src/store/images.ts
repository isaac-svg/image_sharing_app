import { create } from "zustand";
import { BASE_ENDPOINT } from "../config/base";

export type SingleImage = {
  _id: string;
  authorId: string;
  description: string;
  url?: string;
  likes: string[];
  likesCount: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  base64Image?: string;
};

export type Page = {
  page: {
    totalImages: number;
    posts: SingleImage[];
    totalPages: number;
    currentPage: number;
  };
  getImages: () => Promise<SingleImage[]>;
  getNextPage: (nextPage: number) => Promise<SingleImage[]>;

  getImageById: (id: string | undefined) => SingleImage | undefined;
  deleteImage: ({
    imageId,
    authorId,
  }: {
    imageId: string;
    authorId: string;
  }) => Promise<SingleImage[] | undefined>;
  updateImage: ({
    url,
    description,
    authorId,
    imageId,
  }: {
    imageId: string;
    authorId: string;
    url: string | undefined;
    description: string;
  }) => Promise<SingleImage[]>;
  createImage: ({
    url,
    description,
    base64Image,
    category,
  }: {
    category: string;
    base64Image: string | undefined;
    url: string | undefined;
    description: string;
  }) => Promise<SingleImage[]>;
  voteImage: ({
    imageId,
    imageAuthorId,
    voterId,
  }: {
    imageId: string;
    imageAuthorId: string;
    voterId: string;
  }) => Promise<SingleImage[] | undefined>;
  searchCategory: ({
    category,
  }: {
    category: string | undefined;
  }) => Promise<SingleImage[] | undefined>;
};
export const useImages = create<Page>()((set, get) => ({
  page: {
    totalImages: 0,
    posts: [],
    totalPages: 0,
    currentPage: 0,
  },
  getNextPage: async (nextPage) => {
    const response = await fetch(`${BASE_ENDPOINT}/all?page=${nextPage}`);
    const data = await response.json();
    // console.log(data, "all images");
    if (data && data.posts) {
      set((state) => {
        state.page.posts = [...state.page.posts, ...data.posts];
        return state;
      });
    }
    return get().page.posts.reverse();
  },
  getImages: async () => {
    const response = await fetch(`${BASE_ENDPOINT}/all`);
    const data = await response.json();
    // console.log(data, "all images");
    if (data && data.posts) {
      set((state) => {
        state.page.posts = [...data.posts];
        return state;
      });
    }
    return get().page.posts.reverse();
  },

  searchCategory: async ({ category }: { category: string | undefined }) => {
    try {
      const response = await fetch(`${BASE_ENDPOINT}/all?category=${category}`);
      const data = await response.json();
      // console.log(data, "all images");
      if (data && data.posts) {
        set((state) => ({
          page: {
            ...state.page,
            posts: data.posts,
          },
        }));
      }
      console.log(get().page.posts);
      return get().page.posts.reverse();
    } catch (error) {
      console.log(error);
    }
  },
  createImage: async ({
    base64Image,
    url,
    category,
    description,
  }: {
    base64Image: string | undefined;
    url: string | undefined;
    category: string;
    description: string;
  }) => {
    const payload = {
      base64Image,
      url,
      category,
      description,
    };
    try {
      const response = await fetch(`${BASE_ENDPOINT}/myunsplash/create`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ ...payload }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      // console.log(data, "just data");
      set((state) => {
        if (data._id) {
          // console.log(data, "data._id");

          return {
            ...state,
            page: {
              posts: [data, ...state.page.posts],
              currentPage: state.page.currentPage,
              totalImages: state.page.totalImages,
              totalPages: state.page.totalImages,
            },
          };
        }
        return state;
      });
    } catch (error) {
      console.log(error);
    }
    return get().page.posts;
  },

  voteImage: async ({
    imageId,
    imageAuthorId,
    voterId,
  }: {
    imageId: string;
    imageAuthorId: string;
    voterId: string;
  }) => {
    try {
      const response = await fetch(`${BASE_ENDPOINT}/myunsplash/vote`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageId, imageAuthorId, voterId }),
      });
      const data = await response.json();
      set((state) => {
        state.page.posts = state.page.posts.map((image) => {
          if (image._id == data._id) {
            image = data;
          }
          return image;
        });
        return state;
      });

      return get().page.posts.reverse();
    } catch (error) {
      console.log(error);
    }
  },
  deleteImage: async ({
    imageId,
    authorId,
  }: {
    imageId: string;
    authorId: string;
  }) => {
    try {
      const response = await fetch(`${BASE_ENDPOINT}/myunsplash/delete`, {
        method: "DELETE",
        body: JSON.stringify({ imageId, authorId }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
      set((state) => {
        if (data.success) {
          return {
            ...state,
            page: {
              posts: state.page.posts.filter((image) => image._id !== imageId),
              currentPage: state.page.currentPage,
              totalImages: state.page.totalImages,
              totalPages: state.page.totalImages,
            },
          };
        }

        return state;
      });
      await get().getImages();
      return get().page.posts.reverse();
    } catch (error) {
      console.log(error);
    }
  },
  updateImage: async ({
    url,
    description,
    authorId,
    imageId,
  }: {
    imageId: string;
    authorId: string;
    url: string | undefined;
    description: string;
  }) => {
    const response = await fetch(
      `${BASE_ENDPOINT}/myunsplash/update/${authorId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ imageId, authorId, url, description }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await response.json();

    set((state) => {
      state.page.posts = { ...state.page.posts, ...data };
      return state;
    });
    await get().getImages();
    return get().page.posts.reverse();
  },
  getImageById: (id: string | undefined) => {
    return get().page.posts.find((image) => image._id === id);
  },
}));
