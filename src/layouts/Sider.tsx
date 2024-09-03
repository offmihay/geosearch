import React, { useEffect, useState } from "react";
import {
  FormOutlined,
  CompassOutlined,
  CloseOutlined,
  LogoutOutlined,
  SettingOutlined,
  HistoryOutlined,
  EnvironmentOutlined,
  UserOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { Layout, Menu, MenuProps, Button } from "antd";
import { useNavigate } from "react-router-dom";
import useIsMobile from "../hooks/useIsMobile";
import { useAuth } from "../hooks/useAuth";
import { useModal } from "../hooks/useModal";
import { Role } from "../types/enum/role.enum";

export interface Props {
  isCollapsed: boolean;
  setIsCollapsed: () => void;
}

const Sider = ({ isCollapsed, setIsCollapsed }: Props) => {
  const { Sider } = Layout;
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const modal = useModal();
  const auth = useAuth();

  const [activeKey, setActiveKey] = useState<string>(
    localStorage.getItem("siderMenuActive") || "create-route"
  );

  useEffect(() => {
    handleSetActiveMenu(activeKey);
    const suffix = localStorage.getItem("suffixLink") || "";
    navigate(`${activeKey}/${suffix}`);
  }, []);

  useEffect(() => {
    activeKey !== "route" && localStorage.setItem("suffixLink", "");
  }, [activeKey]);

  const handleSetActiveMenu = (key: string) => {
    setActiveKey(key);
    localStorage.setItem("siderMenuActive", key);
    navigate(key);
  };

  const siderMenuData: MenuProps["items"] = [
    {
      key: "create-route",
      icon: React.createElement(EnvironmentOutlined),
      label: "Створити маршрут ",
      onClick: () => {
        handleSetActiveMenu("create-route");
        setIsCollapsed();
      },
    },
    {
      key: "routes",
      icon: React.createElement(FormOutlined),
      label: "Працювати",
      onClick: () => {
        handleSetActiveMenu("routes");
        setIsCollapsed();
      },
    },
    {
      key: "history",
      icon: React.createElement(HistoryOutlined),
      label: "Історія",
      onClick: () => {
        handleSetActiveMenu("history");
        setIsCollapsed();
      },
    },
    auth?.isAdmin(Role.Admin)
      ? {
          key: "statistics",
          icon: React.createElement(BarChartOutlined),
          label: "Статистика",
          onClick: () => {
            handleSetActiveMenu("statistics");
            setIsCollapsed();
          },
        }
      : null,
    auth?.isAdmin(Role.Admin)
      ? {
          key: "users",
          icon: React.createElement(UserOutlined),
          label: "Користувачі",
          onClick: () => {
            handleSetActiveMenu("users");
            setIsCollapsed();
          },
        }
      : null,
    auth?.isAdmin(Role.Admin)
      ? {
          key: "find-places",
          icon: React.createElement(CompassOutlined),
          label: "Знайти точки",
          onClick: () => {
            handleSetActiveMenu("find-places");
            setIsCollapsed();
          },
        }
      : null
  ];

  return (
    <>
      <Sider
        width={300}
        className="!bg-white shadow-xl relative"
        trigger={null}
        style={{
          height: "100dvh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 20,
        }}
        collapsedWidth="0"
        collapsible
        collapsed={isMobile ? isCollapsed : false}
      >
        <div className="absolute top-0 w-full pl-7 pt-8">
          <img
            src="https://ukrzoovet.com.ua/static/images/logo.svg?v=1643281256"
            className="w-7/12"
            alt=""
          />
        </div>
        {isMobile && (
          <div className="absolute rounded-full right-4 top-4">
            <Button
              type="text"
              icon={<CloseOutlined style={{ fontSize: 20 }} />}
              onClick={setIsCollapsed}
              style={{
                width: 40,
                height: 40,
              }}
            />
          </div>
        )}
        {isMobile && (
          <div
            className={`w-full pt-24 pb-6 ${!isCollapsed ? "ml-6" : "ml-[-200px]"} transition-all`}
          >
            <p className={`mt-4 font-medium text-[18px] w-[200px]`}>Вітаємо, {auth?.username}!</p>
          </div>
        )}
        {!isMobile && (
          <div className={`w-full pt-24 pb-6 ml-6`}>
            <p className={`mt-4 font-medium text-[18px] w-[200px]`}>Вітаємо, {auth?.username}!</p>
          </div>
        )}
        <Menu
          mode="inline"
          style={{ borderRight: 0 }}
          items={siderMenuData}
          selectedKeys={[activeKey]}
        />
        <div className="absolute bottom-0 left-0 right-0 w-full flex justify-between gap-2 p-4">
          {!isMobile ? (
            <Button
              disabled={document.readyState === "loading"}
              size="large"
              icon={<SettingOutlined />}
              onClick={() => modal?.open("settings")}
            ></Button>
          ) : (
            <div></div>
          )}
          {!isCollapsed && isMobile && (
            <Button size="large" onClick={auth?.logOut} icon={<LogoutOutlined />}></Button>
          )}
          {!isMobile && (
            <Button size="large" onClick={auth?.logOut} icon={<LogoutOutlined />}></Button>
          )}
        </div>
      </Sider>
    </>
  );
};

export default Sider;
