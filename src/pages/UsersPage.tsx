import { UserAddOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification } from "antd";
import { useSignUpMutation } from "../queries/auth.query";

const UsersPage = () => {
  const [formSignUp] = Form.useForm();
  const signUpMutation = useSignUpMutation();

  const handleSignUp = async () => {
    const values = await formSignUp.validateFields();
    signUpMutation.mutate(values, {
      onSuccess: () => {
        notification.success({
          message: "Успішно",
          description: "Користувача успішно додано!",
        });
      },
      onError: (error) => {
        notification.error({
          message: "Помилка",
          description: `${error.message}`,
        });
      },
    });
  };

  return (
    <div className="w-full flex flex-col justify-center items-center h-[100%] p-16">
      <Form
        form={formSignUp}
        labelCol={{ span: 4 }}
        className="max-w-[400px] w-full"
        layout="horizontal"
      >
        <Form.Item label="Логін" name="username">
          <Input />
        </Form.Item>
        <Form.Item label="Пароль" name="password">
          <Input />
        </Form.Item>
        <div className="w-full flex">
          <Button
            icon={<UserAddOutlined />}
            type="primary"
            className="m-auto"
            onClick={handleSignUp}
          >
            Створити Користувача
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UsersPage;
