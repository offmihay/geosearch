import React from "react";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { LoginField } from "../types/LoginField.type";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LoginPage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const onFinish: FormProps<LoginField>["onFinish"] = (values) => {
    auth?.login({ username: values.username, password: values.password });
    navigate("");
  };

  const onFinishFailed: FormProps<LoginField>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="min-h-[100dvh] w-full flex justify-center items-center">
      <div className="px-10 py-12 rounded-2xl ">
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, width: "100%" }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<LoginField>
            label="Логін"
            name="username"
            rules={[{ required: true, message: "Введіть логін!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<LoginField>
            label="Пароль"
            name="password"
            rules={[{ required: true, message: "Введіть пароль!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item className="w-full flex justify-center">
            <Button type="primary" htmlType="submit" className="w-[150px] h-[50px]">
              Увійти
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
