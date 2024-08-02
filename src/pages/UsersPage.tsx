import { UserAddOutlined } from "@ant-design/icons";
import { Button, FloatButton, Form, Input, Modal, notification, Select } from "antd";
import { useSignUpMutation } from "../queries/auth.query";
import useIsMobile from "../hooks/useIsMobile";
import { useState } from "react";
import { Regions } from "../types/enum/regions.enum";

const UsersPage = () => {
  const [formSignUp] = Form.useForm();
  const signUpMutation = useSignUpMutation();
  const isMobile = useIsMobile();

  const [openModal, setOpenModal] = useState(false);

  const handleSignUp = async () => {
    const values = await formSignUp.validateFields();
    if (values.regions) {
      values.preferences = { regions: values.regions };
      delete values.regions;
    }
    signUpMutation.mutate(values, {
      onSuccess: () => {
        notification.success({
          message: "Успішно",
          description: "Користувача успішно додано!",
        });
        setOpenModal(false);
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
    <>
      <Modal
        title="Додати користувача"
        centered
        wrapClassName="!top-2"
        open={openModal}
        onOk={handleSignUp}
        onCancel={() => {
          setOpenModal(false);
        }}
        okText={
          <>
            {" "}
            <Button
              icon={<UserAddOutlined />}
              type="primary"
              className="m-auto"
              onClick={handleSignUp}
            >
              Створити Користувача
            </Button>
          </>
        }
        width={1000}
      >
        <div className="flex w-full justify-center p-8">
          <Form
            form={formSignUp}
            labelCol={{ span: 10 }}
            className="max-w-[400px] w-full"
            layout="horizontal"
          >
            <Form.Item label="Логін" name="username" required>
              <Input />
            </Form.Item>
            <Form.Item label="Пароль" name="password" required>
              <Input />
            </Form.Item>
            <Form.Item label="Регіони на карті" name="regions">
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Please select"
                options={Object.values(Regions).map((item: string) => ({
                  label: item,
                  value: item,
                }))}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <FloatButton
        icon={<UserAddOutlined style={{ fontSize: 25 }} />}
        shape="circle"
        style={{ right: isMobile ? 30 : 100, bottom: isMobile ? 30 : 100, width: 60, height: 60 }}
        className="flex justify-center items-center"
        onClick={() => setOpenModal(true)}
      />
    </>
  );
};

export default UsersPage;
