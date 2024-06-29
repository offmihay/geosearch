import { Button, Layout } from "antd";

import { MenuOutlined } from "@ant-design/icons";
import useIsMobile from "../hooks/useIsMobile";

export interface HeaderProps {
  setIsCollapsed: () => void;
}

const Header = ({ setIsCollapsed }: HeaderProps) => {
  const { Header } = Layout;

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
      )}
      <div></div>
      <div></div>
    </Header>
  );
};

export default Header;
