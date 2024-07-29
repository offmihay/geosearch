import { Divider, Form, Modal, notification, Select, Spin, Switch } from "antd";
import { useModal } from "../hooks/useModal";
import {
  useAdminPreferencesMutation,
  useAdminPreferencesQuery,
  useUserPreferencesMutation,
  useUserPreferencesQuery,
} from "../queries/user.query";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Role } from "../types/enum/role.enum";

const SettingsWindow = () => {
  const modal = useModal();
  if (modal?.active != "settings") return null;
  const auth = useAuth();

  const [formUser] = Form.useForm();
  const [formAdmin] = Form.useForm();

  const userPreferencesQuery = useUserPreferencesQuery();
  const userPreferencesMutation = useUserPreferencesMutation();

  const adminPreferencesQuery = useAdminPreferencesQuery(auth?.isAdmin(Role.Admin) || false);
  const adminPreferencesMutation = useAdminPreferencesMutation();

  const handleSave = async () => {
    const valuesUser = await formUser.validateFields();
    const valuesAdmin = await formAdmin.validateFields();

    userPreferencesMutation.mutate({ preferences: valuesUser });

    adminPreferencesQuery.isSuccess &&
      adminPreferencesMutation.mutate({ preferences: valuesAdmin });
  };

  useEffect(() => {
    if (userPreferencesQuery.isSuccess) {
      formUser.setFieldsValue({
        regions: userPreferencesQuery.data.preferences.regions || [],
        show_done_places: userPreferencesQuery.data.preferences.show_done_places || false,
      });
    }
    if (adminPreferencesQuery.isSuccess) {
      formAdmin.setFieldsValue({
        show_all_routes: adminPreferencesQuery.data.preferences.show_all_routes || false,
        show_all_places: adminPreferencesQuery.data.preferences.show_all_places || false,
      });
    }
  }, [userPreferencesQuery.fetchStatus, adminPreferencesQuery.fetchStatus]);

  useEffect(() => {
    if (
      userPreferencesMutation.isSuccess &&
      (adminPreferencesQuery.isSuccess ? adminPreferencesMutation.isSuccess : true)
    ) {
      notification.success({
        message: "Успішно",
        description: "Налаштування успішно змінено!",
      });
      modal.close();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, [userPreferencesMutation.status, adminPreferencesMutation.status]);

  return (
    <>
      <Spin spinning={adminPreferencesQuery.isFetching || userPreferencesQuery.isFetching}>
        <Modal
          title="Налаштування"
          onCancel={modal.close}
          onOk={handleSave}
          zIndex={100}
          centered
          width={1000}
          open={true}
        >
          <Form
            form={formUser}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
          >
            <Form.Item label="Регіони на карті" name="regions">
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Please select"
                options={
                  userPreferencesQuery.data?.preferences_possibleValues?.regions &&
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
            <Form.Item label="Показувати на карті зроблені точки" name="show_done_places">
              <Switch />
            </Form.Item>
          </Form>
          {adminPreferencesQuery.isSuccess && (
            <>
              <Divider />
              <Form
                form={formAdmin}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
              >
                <Form.Item label="Показувати маршрути всіх користувачів" name="show_all_routes">
                  <Switch />
                </Form.Item>
                <Form.Item label="Показувати місця всіх користувачів" name="show_all_places">
                  <Switch />
                </Form.Item>
              </Form>
            </>
          )}
        </Modal>
      </Spin>
    </>
  );
};

export default SettingsWindow;
