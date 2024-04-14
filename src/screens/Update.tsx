import { Checkbox, CheckboxProps, Form, Image, Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useImages } from "../store/images";
import { Input } from "antd";
import { FormEvent, useState } from "react";
import { useModal } from "../store/modal";
import { useUser } from "../store/user";
const { TextArea } = Input;

const Update: React.FC = () => {
  const [url, setUrl] = useState<string>();
  const [description, setDescription] = useState<string>("");

  const [showImageFields, setShowImageFields] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // const [loading, setLoading] = useState(false);
  const toggleuploadModal = useModal((state) => state.toggleuploadModal);
  const authorId = useUser((state) => state.user.id);
  console.log(authorId, "authorId");
  const navigate = useNavigate();
  const { id } = useParams<"id">();
  const getImageById = useImages((state) => state.getImageById);
  const updateImage = useImages((state) => state.updateImage);
  const image = getImageById(id);
  // console.log(image, "image");
  const handleCancel = () => {
    console.log("Clicked cancel button");
    toggleuploadModal(false);
    navigate(-1);
    // console.log(locaupload, "locaupload");
  };
  const handleUpload = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();

    // setLoading(true);
    setConfirmLoading(true);

    const payload = {
      url,
      description,
      authorId,
      imageId: id as string,
    };
    console.log(payload);
    const response = await updateImage({
      url,
      description,
      authorId,
      imageId: payload.imageId,
    });
    console.log(response, "response");

    if (response) {
      setIsSuccess(true);
      // setLoading(false);
      setConfirmLoading(false);
      toggleuploadModal(false);
    }
    console.log(url);
    console.log(response);
  };
  const onChange: CheckboxProps["onChange"] = (e) => {
    console.log("checked = ", e.target.checked);
    setShowImageFields(e.target.checked);
  };
  return (
    <>
      <>
        {isSuccess ?? <p>Success</p>}
        <Modal
          title="Update"
          open={true}
          onOk={handleUpload}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          okText="Update"
          //   footer={null}
          //   footer=""
        >
          <Form className="">
            <Form.Item>
              <div className="h-[300px] overflow-hidden">
                <Image
                  src={image?.url || image?.base64Image}
                  alt="Image description"
                  className="object-cover h-full w-full"
                />
              </div>
            </Form.Item>
            description
            <p style={{ marginBottom: "20px" }}>
              <Checkbox checked={showImageFields} onChange={onChange}>
                Update Image?
              </Checkbox>
            </p>
            <div className={`${showImageFields ? "block" : "hidden"}`}>
              {" "}
              <Form.Item
                name="url"
                label="URL"
                rules={[
                  { required: false },
                  { type: "url", warningOnly: true },
                  { type: "string", min: 6 },
                ]}
              >
                <Input
                  disabled={false}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </Form.Item>
            </div>
            <Form.Item label="Change description" required>
              <TextArea
                rows={4}
                placeholder="minLength is 6"
                minLength={5}
                allowClear
                showCount
                maxLength={100}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Modal>
      </>
    </>
  );
};

export default Update;
