import React, { useState } from "react";
import { Button, Input, Modal, Form as AntForm, message } from "antd";
import { useModal } from "../store/modal";
import { Form, Link, useNavigate } from "react-router-dom";
import { redirect } from "react-router-dom";
import { BASE_ENDPOINT } from "../config/base";
import { NoticeType } from "antd/es/message/interface";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);
  // console.log(credentials);
  await fetch(`${BASE_ENDPOINT}/auth/register`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ ...credentials }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // const data = await response.json();
  // console.log(data);
  return redirect("/");
}
const Register: React.FC = () => {
  // const { register } = useModal((state) => state.protectedmodals);
  // const { register: localregister } = useModal((state) => state.localmodals);
  const toggleregisterModal = useModal((state) => state.toggleregisterModal);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const alertModal = (text: string, type: NoticeType) => {
    messageApi.open({
      type: type,
      content: text,
    });
  };

  const navigate = useNavigate();

  // console.log(register, "register");
  const handleOk = () => {
    // setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    // console.log();
    setTimeout(() => {
      toggleregisterModal(false);
      setConfirmLoading(false);
      navigate(-1);
    }, 2000);
  };
  const info = ({ msg }: { msg: string }) => {
    message.info(msg);
  };
  const handleCancel = () => {
    // console.log("Clicked cancel button");
    toggleregisterModal(false);
    navigate(-1);
    // console.log(localregister, "localregister");
  };

  const onFinish = async (value: { username: string; password: string }) => {
    // console.log(value);
    setConfirmLoading(true);
    // console.log();

    const response = await fetch(`${BASE_ENDPOINT}/auth/register`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ ...value }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = (await response.json()) as {
      success: boolean;
      message: string;
    };
    // console.log(data);
    setConfirmLoading(false);
    toggleregisterModal(false);
    if (data.success) {
      info({ msg: "Registration successful" });
      navigate("/login");
      window.location.reload();
    } else {
      setIsError(true);
      if (isError && data.message.includes("E11000")) {
        alertModal("Username or Email is already taken", "error");
      }

      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }
  };

  return (
    <>
      {contextHolder}
      <Form method="post">
        {/* <Button type="primary" onClick={showModal}>
        Open Modal with async logic
      </Button> */}

        <Modal
          title=""
          open={true}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          okText="Register"
          footer=""
          // okButtonProps=
        >
          <AntForm method="post" onFinish={onFinish}>
            <div>
              <h2 className="text-center text-2xl font-bold mb-4">
                Register an account with us
              </h2>
            </div>
            <AntForm.Item
              name="username"
              label="User name"
              rules={[
                {
                  type: "string",
                },
                {
                  required: true,
                  message: "Please provide a user name!",
                },
                {
                  min: 5,
                  message: "User name can not be less tha 5 characters long!",
                },
              ]}
            >
              <Input type="string" />
            </AntForm.Item>
            <AntForm.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: "email",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input />
            </AntForm.Item>
            <AntForm.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
                {
                  min: 5,
                  message: "Password can not be less than 5 characters long",
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="" />
            </AntForm.Item>

            <AntForm.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      // console.log(value);
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The new password that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </AntForm.Item>

            <div className="mr-auto  mb-4 gap-4  flex justify-end">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                htmlType="submit"
                loading={confirmLoading}
                className="bg-blue-500 text-white"
              >
                {/* <button type="submit">register</button> */}
                Register
              </Button>
            </div>
            <div>
              <p className="text-center text-sm">
                Already have an account?{" "}
                <Link className="text-blue-500 text-base" to="/login">
                  Login
                </Link>{" "}
              </p>
            </div>
          </AntForm>
        </Modal>
      </Form>
    </>
  );
};

export default Register;
