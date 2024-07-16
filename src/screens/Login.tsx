import React, { useState } from "react";
import {
  Button,
  Alert,
  Checkbox,
  Input,
  Modal,
  message,
  Form as AntForm,
  Spin,
} from "antd";
import { useModal } from "../store/modal";
import { Form, Link, useNavigate } from "react-router-dom";
import { redirect } from "react-router-dom";
import { LoadingOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { BASE_ENDPOINT } from "../config/base";
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);
  // console.log(credentials);
  const response = await fetch(`${BASE_ENDPOINT}/auth/login`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ ...credentials }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  // console.log(data);
  // info({ msg: "login successfull" });
  return redirect("/");
}
const Login: React.FC = () => {
  const { login } = useModal((state) => state.protectedmodals);
  const { login: locallogin } = useModal((state) => state.localmodals);
  const toggleloginModal = useModal((state) => state.toggleloginModal);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  // console.log(login, "login");

  const info = ({ msg }: { msg: string }) => {
    message.info(msg);
  };
  // const info = ({ msg }: { msg: string }) => {
  //   message.info(msg);
  // };
  const handleOk = () => {
    // setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    // console.log();
    setTimeout(() => {
      toggleloginModal(false);
      setConfirmLoading(false);
      navigate(-1);
    }, 2000);
  };

  const handleCancel = () => {
    // console.log("Clicked cancel button");
    toggleloginModal(false);
    navigate(-1);
    // console.log(locallogin, "locallogin");
  };

  const onFinish = async (values: { username: string; password: string }) => {
    // console.log("Received values of form: ", values);
    setConfirmLoading(true);
    const response = await fetch(`${BASE_ENDPOINT}/auth/login`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ ...values }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    // console.log(data);
    if (data.success) {
      info({ msg: "login successfull" });
      setConfirmLoading(false);

      return navigate("/");
    } else {
      setIsError(true);
      setConfirmLoading(false);
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }
  };
  return (
    <>
      {isError && (
        <Alert
          closable
          message="Login failed failed check your credentials"
          type="error"
          className="top-5 right-5 absolute z-[9999]"
        />
      )}
      <Form method="post">
        <Modal
          title=""
          open={login && locallogin}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          okText="Login"
          footer=""
          // okButtonProps=
        >
          <div>
            <h2 className="text-center text-2xl font-bold mb-4">
              Login to your account
            </h2>
          </div>
          <AntForm
            method="post"
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <AntForm.Item
              name="username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </AntForm.Item>
            <AntForm.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder=""
              />
            </AntForm.Item>
            <AntForm.Item>
              <AntForm.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </AntForm.Item>

              <a className="login-form-forgot" href="">
                Forgot password
              </a>
            </AntForm.Item>
            <div className="mr-auto gap-4  flex justify-end">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button htmlType="submit" className="bg-blue-500 text-white">
                {confirmLoading && (
                  <Spin
                    indicator={
                      <LoadingOutlined style={{ fontSize: 24 }} spin />
                    }
                  />
                )}
                {/* <button type="submit">login</button> */}
                Login
              </Button>
            </div>
            <AntForm.Item>
              <div>
                <p className="text-center text-sm">
                  Don't have an account?{" "}
                  <Link className="text-blue-500 text-base" to="/register">
                    Register
                  </Link>{" "}
                </p>
              </div>
            </AntForm.Item>
          </AntForm>
        </Modal>
      </Form>
    </>
  );
};

export default Login;
