import { create } from "zustand";

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
  getImageById: (id: string | undefined) => SingleImage | undefined;
  deleteImage: ({
    imageId,
    authorId,
  }: {
    imageId: string;
    authorId: string;
  }) => Promise<SingleImage[]>;
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
  voteImage: ({
    imageId,
    imageAuthorId,
    voterId,
  }: {
    imageId: string;
    imageAuthorId: string;
    voterId: string;
  }) => Promise<SingleImage[]>;
  searchCategory: ({
    category,
  }: {
    category: string | undefined;
  }) => Promise<SingleImage[]>;
};
export const useImages = create<Page>()((set, get) => ({
  page: {
    totalImages: 0,
    posts: [],
    totalPages: 0,
    currentPage: 0,
  },
  getImages: async () => {
    const response = await fetch(
      "https://image-sharing-api-ten.vercel.app/all"
    );
    const data = await response.json();
    console.log(data, "all images");
    if (data && data.posts) {
      set((state) => {
        state.page.posts = [...data.posts];
        return state;
      });
    }

    return get().page.posts.reverse();
  },
  searchCategory: async ({ category }: { category: string | undefined }) => {
    const response = await fetch(
      `https://image-sharing-api-ten.vercel.app/all?category=${category}`
    );
    const data = await response.json();
    console.log(data, "all images");
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
    const response = await fetch(
      "https://image-sharing-api-ten.vercel.app/myunsplash/vote",
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageId, imageAuthorId, voterId }),
      }
    );
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
  },
  deleteImage: async ({
    imageId,
    authorId,
  }: {
    imageId: string;
    authorId: string;
  }) => {
    const response = await fetch(
      "https://image-sharing-api-ten.vercel.app/myunsplash/delete",
      {
        method: "DELETE",
        body: JSON.stringify({ imageId, authorId }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await response.json();
    console.log(data);
    set((state) => {
      state.page = { ...state.page, ...data };
      return state;
    });
    await get().getImages();
    return get().page.posts.reverse();
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
      `https://image-sharing-api-ten.vercel.app/myunsplash/update/${authorId}`,
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
