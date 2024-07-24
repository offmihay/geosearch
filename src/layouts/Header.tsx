import { Button, Layout } from "antd";

import { MenuOutlined, SettingOutlined } from "@ant-design/icons";
import useIsMobile from "../hooks/useIsMobile";
import { useModal } from "../hooks/useModal";

export interface HeaderProps {
  setIsCollapsed: () => void;
}

const Header = ({ setIsCollapsed }: HeaderProps) => {
  const { Header } = Layout;
  const modal = useModal();

  const isMobile = useIsMobile();

  return (
    <Header
      className={` ${
        isMobile ? "!px-4 flex items-center justify-between bg-white gap-5" : "!hidden"
      }`}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      {isMobile && (
        <>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={setIsCollapsed}
            style={{
              fontSize: "16px",
              width: 48,
              height: 48,
            }}
          />
          <Button
            size="large"
            type="text"
            icon={<SettingOutlined />}
            onClick={() => modal?.open("settings")}
          ></Button>
        </>
      )}
    </Header>
  );
};

export default Header;
