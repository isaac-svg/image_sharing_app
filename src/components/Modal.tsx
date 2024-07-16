import React, { useEffect, useState } from "react";
import { Alert, Modal as AntModal, Button, Image, Spin, message } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
// import { getImageById } from "../dummydata/images";
import { useImages } from "../store/images";
import { useUser } from "../store/user";
import { LoadingOutlined } from "@ant-design/icons";

const Modal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUnliking, setIsUnliking] = useState<boolean>(false);
  const getUserPayload = useUser((state) => state.getUserPayload);
  const user = useUser((state) => state.user);
  const getImageById = useImages((state) => state.getImageById);
  const deleteImage = useImages((state) => state.deleteImage);
  const voteImage = useImages((state) => state.voteImage);
  // const [confirmLoading, setConfirmLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<"id">();

  useEffect(() => {
    async function getuser() {
      await getUserPayload();
    }
    getuser();
  }, []);

  const info = ({ msg }: { msg: string }) => {
    message.info(msg);
  };
  const image = getImageById(id)!;
  console.log(image?.likes, "image.likes");
  console.log(image, "by getImageById(id)");
  console.log(user, "user");

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
    navigate(-1);
  };

  return (
    <>
      {isDeleting && (
        <Alert
          message="Memory deleting successful"
          className="h-14 bg-green absolute top-5 right-5 z-[9999]"
          type="success"
          showIcon
          closable
        />
      )}

      <div>
        <AntModal
          centered
          title={`Image posted by ${user?.name}`}
          open={typeof id === "string" && !open}
          // onOk={handleVote}
          // confirmLoading={confirmLoading}
          onCancel={handleCancel}
          className="rounded-lg"
          // okText="Update"
          // cancelText="Delete"
          footer={null}
        >
          <div className="h-[300px] overflow-hidden">
            <Image
              src={`${image?.url || image?.base64Image}`}
              alt={`${image?.description}  `}
              className="object-cover h-full w-full"
            />
          </div>
          <div className="w-full py-2">
            <p className="text-base text-gray-700">Category:</p>
            <p>{image?.category}</p>
          </div>
          <div className="w-full py-2">
            <p className="text-base text-gray-700">Memory: </p>
            <p>{image?.description}</p>
          </div>
          {image?.authorId === user.id ? (
            <div className="mr-auto  my-4 gap-4  flex justify-end">
              <Button
                onClick={async () => {
                  setIsDeleting(true);
                  await deleteImage({ authorId: user.id, imageId: image._id });
                  setIsDeleting(false);
                  handleCancel();
                  info({
                    msg: "You have deleted this image",
                  });
                }}
              >
                {isDeleting && (
                  <Spin
                    indicator={
                      <LoadingOutlined style={{ fontSize: 24 }} spin />
                    }
                  />
                )}{" "}
                Delete
              </Button>
              <Button
                htmlType="submit"
                className="bg-blue-500 text-white"
                // onClick={handleOk}
              >
                {/* <button type="submit">login</button> */}
                <Link to={`/img/update/${image._id}`}> Update</Link>
              </Button>
            </div>
          ) : (
            <div className="mr-auto  my-4 gap-4  flex justify-end">
              {
                // image.likes
                image?.likes.includes(user.id) ? (
                  <>
                    <Button
                      onClick={async () => {
                        setIsUnliking(true);
                        if (image.authorId === user.id) {
                          info({ msg: "You can not unlike your own image" });
                          return;
                        }
                        await voteImage({
                          imageId: id as string,
                          imageAuthorId: image.authorId,
                          voterId: user.id,
                        });
                        setOpen(false);
                        navigate(-1);
                        setIsUnliking(false);
                        info({ msg: "You have unliked this image" });
                      }}
                    >
                      {" "}
                      {isUnliking && (
                        <Spin
                          indicator={
                            <LoadingOutlined style={{ fontSize: 24 }} spin />
                          }
                        />
                      )}
                      Unlike
                    </Button>
                  </>
                ) : (
                  <Button
                    htmlType="submit"
                    className="bg-blue-500 text-white"
                    onClick={async () => {
                      if (!user.name) {
                        navigate("/login");
                        window.location.reload();
                        return;
                      }
                      setIsLiking(true);
                      console.log({ imageId: id, authorId: user.id });
                      if (image.authorId === user.id) {
                        info({ msg: "You can not like your own image" });
                        return;
                      }
                      await voteImage({
                        imageId: id as string,
                        imageAuthorId: image.authorId!,
                        voterId: user.id,
                      });
                      setOpen(false);
                      navigate(-1);
                      setIsLiking(false);
                      info({
                        msg: "You have liked this image",
                      });
                    }}
                  >
                    {/* <button type="submit">login</button> */}
                    {isLiking && (
                      <Spin
                        indicator={
                          <LoadingOutlined style={{ fontSize: 24 }} spin />
                        }
                      />
                    )}
                    Like
                  </Button>
                )
              }
            </div>
          )}
        </AntModal>
      </div>
    </>
  );
};

export default Modal;
