import { Content as AntContent } from "antd/es/layout/layout";
import { Link, Outlet } from "react-router-dom";
import { SingleImage, useImages } from "../store/images";
import { useEffect, useState } from "react";
import ContentSkeleton from "./ContentSkeleton";
import Imageview from "./Imageview";

const Content = () => {
  const posts = useImages((state) => state.page.posts);
  const [_posts, setPosts] = useState<SingleImage[]>([]);
  // const posts = useImages((state) => state.page.posts);
  const getImages = useImages((state) => state.getImages);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPosts(await getImages());
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
          _posts?.map((image) => {
            return (
              <Imageview key={image._id}>
                <Link
                  key={image._id}
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
            );
          })
        )}
        <Outlet />
      </div>
    </AntContent>
  );
};

export default Content;
