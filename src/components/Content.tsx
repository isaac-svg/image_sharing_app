import { Content as AntContent } from "antd/es/layout/layout";
import { Link, Outlet } from "react-router-dom";
import { SingleImage, useImages } from "../store/images";
import { useCallback, useEffect, useRef, useState } from "react";
import ContentSkeleton from "./ContentSkeleton";
import Imageview from "./Imageview";
import { BASE_ENDPOINT } from "../config/base";

const Content = () => {
  const posts = useImages((state) => state.page.posts);
  const [_posts, setPosts] = useState<SingleImage[]>([]);
  // const posts = useImages((state) => state.page.posts);
  const getImages = useImages((state) => state.getImages);
  const getNextPage = useImages((state) => state.getNextPage);

  const [data, setData] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    fetchData(page);
  }, [page]);
  const fetchData = async (page: number) => {
    setLoading(true);
    const response = await getNextPage(page);

    if (response.length === 0) {
      setHasMore(false);
    } else {
      setPosts((prevData: SingleImage[]) => [...prevData, ...response]);
    }

    setLoading(false);
  };
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loading ||
      !hasMore
    ) {
      return;
    }
    setPage((prevPage) => prevPage + 1);
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = await getImages();
        setPosts(payload);
        console.log({ payload });
        if (!payload.length) {
          console.log("first");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    setPosts(posts);
  }, [posts]);

  return (
    <AntContent className="h-auto min-h-screen px-2 py-4">
      <div className="masonry-container mx-auto">
        {posts?.length === 0 ? (
          <ContentSkeleton />
        ) : (
          // <div className="bg-green-500 w-screen h-screen"></div>
          _posts?.map((image, index) => {
            return (
              <div>
                <Imageview key={image._id}>
                  <Link
                    to={`img/${image._id}`}
                    className="masonry-item  shadow-sm   cursor-pointer  rounded-lg overflow-hidden  "
                  >
                    <img
                      src={`${image.base64Image || image.url}`}
                      alt={`${image.category}`}
                      className="object-cover h-full w-full"
                    />
                  </Link>
                </Imageview>
              </div>
            );
          })
        )}
        <Outlet />
      </div>
    </AntContent>
  );
};

export default Content;
