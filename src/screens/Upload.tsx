import React, { FormEvent, useRef, useState } from "react";
import {
  Button,
  Input,
  Modal,
  Form as AntForm,
  Checkbox,
  CheckboxProps,
  Alert,
  Select,
  message,
} from "antd";
import { useModal } from "../store/modal"; // const [loading, setLoading] = useState(false);
const { TextArea } = Input;
import { useNavigate } from "react-router-dom";
import { redirect } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
// import { convertFileToBase64 } from "../lib/base64";
import { useImages } from "../store/images";
import { uploadImage } from "../lib/uploadtocloud";
// import { User } from "../store/user";
// import { uploadImage } from "../lib/uploadtocloud";
// import Select from "../components/Select";

export async function action({ request }: { request: Request }) {
  // console.log(request);
  const formData = await request.formData();
  // console.log(formData);
  const credentials = Object.fromEntries(formData);
  //   const { image } = credentials;
  // console.log(credentials);
  //   uploadImage(image as unknown as { image: string });
  // console.log(credentials);
  await fetch("/myunsplash/create", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ ...credentials }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  // console.log(response, "response");
  // const data = await response.json();
  // console.log(data);
  return redirect("/");
}

const Upload: React.FC = () => {
  const [checked, setChecked] = useState(true);
  const [url, setUrl] = useState<string>();
  // const [loading, setLoading] = useState(false); // const [loading, setLoading] = useState(false);

  const [filename, setFilename] = useState<string>();
  const [isError, setIsError] = useState(false);

  const [category, setCategory] = useState<string>();
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload } = useModal((state) => state.protectedmodals);
  const createPost = useImages((state) => state.createImage);
  const { upload: locaupload } = useModal((state) => state.localmodals);
  const toggleuploadModal = useModal((state) => state.toggleuploadModal);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [description, setDescription] = useState<string>("");
  const navigate = useNavigate();
  const info = ({ msg }: { msg: string }) => {
    message.info(msg);
  };
  const handleCancel = () => {
    // console.log("Clicked cancel button");
    toggleuploadModal(false);
    navigate(-1);
    // console.log(locaupload, "locaupload");
  };
  const handleUpload = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    console.log("I am being called");
    if (!category) {
      setIsError(true);
      return;
    }
    // setLoading(true);
    setConfirmLoading(true);

    const filedata = fileRef.current?.files?.[0] as Blob;

    setFilename(fileRef.current?.files?.[0]?.name);
    let cloudUrl;
    if (filedata) {
      cloudUrl = await uploadImage(filedata);
    }
    if (filedata && !cloudUrl) return;
    const imageURL = url ? url : cloudUrl;
    let userPayload = JSON.parse(localStorage.getItem("userPayload") ?? "{}");

    const response = await createPost({
      url: imageURL,
      category,
      description,
      authorName: userPayload.name,
    });

    if (response.length) {
      // setLoading(false);
      info({ msg: "Upload successful" });
      setConfirmLoading(false);
      toggleuploadModal(false);
    } else {
      // setLoading(false);
      setConfirmLoading(false);
      setIsError(true);
    }
  };
  // console.log(upload, "upload");

  const onChange: CheckboxProps["onChange"] = (e) => {
    // console.log("checked = ", e.target.checked);
    setChecked(e.target.checked);
  };

  return (
    <>
      {isError && (
        <Alert
          message="Image upload failed. Check your internet connections!"
          className="h-14 bg-green absolute top-5 right-5 z-[9999]"
          type="error"
          showIcon
          closable
        />
      )}

      <>
        <Modal
          title="Upload"
          open={upload && locaupload}
          onOk={handleUpload}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          okText="Upload"
          //   footer={null}
          //   footer=""
        >
          <form>
            <p style={{ marginBottom: "20px" }}>
              <Checkbox checked={checked} onChange={onChange}>
                Upload via URL
              </Checkbox>
            </p>

            <AntForm.Item
              name="url"
              label="URL"
              rules={[
                { required: checked },
                { type: "url", warningOnly: true },
                { type: "string", min: 6 },
              ]}
            >
              <Input
                disabled={!checked}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </AntForm.Item>

            <AntForm.Item
              name="category"
              label="Category"
              rules={[{ required: true }]}
            >
              <Select
                id="sel"
                value={category}
                onChange={(e) => {
                  setCategory(e);
                }}
              >
                <Select.Option value="engineering">engineering</Select.Option>
                <Select.Option value="software">software</Select.Option>
                <Select.Option value="agriculture">agriculture</Select.Option>
                <Select.Option value="medicine">medicine</Select.Option>
                <Select.Option value="social">social</Select.Option>
                <Select.Option value="mathematics">mathematics</Select.Option>
                <Select.Option value="science">science</Select.Option>
                <Select.Option value="general">general</Select.Option>
              </Select>
            </AntForm.Item>
            <AntForm.Item label="Image description" required>
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
            </AntForm.Item>
            <AntForm.Item
              name="image"
              label="File"
              rules={[{ required: !checked }]}
            >
              <div>
                <input
                  disabled={checked}
                  ref={fileRef}
                  name="image"
                  type="file"
                  onChange={(e) => {
                    setFilename(e.target.files?.[0]?.name);
                  }}
                  hidden
                  required={!checked}
                />
                <Button
                  disabled={checked}
                  onClick={() => {
                    fileRef.current?.click();
                  }}
                  icon={<UploadOutlined />}
                >
                  Upload
                </Button>
                <span className="pl-4 ">{filename}</span>
              </div>
            </AntForm.Item>
          </form>
        </Modal>
      </>
    </>
  );
};

export default Upload;
