import { Form, Modal, notification, Select, Switch } from "antd";
import { useModal } from "../hooks/useModal";
import { useUserPreferencesMutation, useUserPreferencesQuery } from "../queries/user.query";
import { useEffect } from "react";

const SettingsWindow = () => {
  const modal = useModal();
  if (modal?.active != "settings") return null;

  const [form] = Form.useForm();

  const userPreferencesQuery = useUserPreferencesQuery();
  const userPreferencesMutation = useUserPreferencesMutation();

  const handleSave = async () => {
    const values = await form.validateFields();
    userPreferencesMutation.mutate(
      { preferences: values },
      {
        onSuccess: () => {
          notification.success({
            message: "Успішно",
            description: "Налаштування успішно змінено!",
          });
          window.location.reload();
          modal.close();
        },
        onError: () => {
          notification.error({
            message: "Помилка",
            description: "Сталась помилка при зміні данних!",
          });
        },
      }
    );
  };

  useEffect(() => {
    form.setFieldsValue({
      regions: userPreferencesQuery.data?.preferences.regions,
      show_all_routes: userPreferencesQuery.data?.preferences.show_all_routes,
    });
  }, [userPreferencesQuery.fetchStatus]);

  return (
    <>
      <Modal
        title="Налаштування"
        onCancel={modal.close}
        onOk={handleSave}
        zIndex={100}
        centered
        width={1000}
        open={true}
      >
        <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} layout="horizontal">
          <Form.Item label="Регіони" name="regions">
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Please select"
              options={
                userPreferencesQuery.data?.preferences_possibleValues.regions &&
                userPreferencesQuery.data?.preferences_possibleValues.regions.length > 0
                  ? userPreferencesQuery.data?.preferences_possibleValues.regions.map(
                      (item: string) => ({
                        label: item,
                        value: item,
                      })
                    )
                  : []
              }
            />
          </Form.Item>
          <Form.Item label="Показувати всі маршрути" name="show_all_routes">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SettingsWindow;
