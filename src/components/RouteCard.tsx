import React from "react";
import { Button, Card, Popconfirm, Progress } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";

interface LogoCardProps {
  percentage?: string;
  title: string;
  date: string;
  img_url: string;
  handleOpenCard: () => void;
  onDelete: () => void;
}

const RouteCard: React.FC<LogoCardProps> = ({
  percentage,
  title,
  date,
  handleOpenCard,
  img_url,
  onDelete,
}) => {
  return (
    <Card className="max-w-[350px] w-full" hoverable onClick={handleOpenCard}>
      <div className="flex flex-col items-center w-full gap-4 mb-4">
        <p className="font-bold text-[20px]">{title}</p>
        <p className="font-normal text-[16px]">{date}</p>
      </div>
      <div className="w-full h-[350px] flex justify-center items-center flex-col gap-4">
        <img src={img_url} className="w-full rounded-2xl" alt="" />
        <Progress percent={Number(percentage)} />
        <Popconfirm
          title="Видалити маршрут"
          description="a u sure"
          icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          onConfirm={onDelete}
          onPopupClick={(event) => {
            event.stopPropagation();
          }}
          okText="Так"
          cancelText="Скасувати"
          overlayClassName="w-[300px]"
        >
          <Button
            type="primary"
            onClick={(event) => {
              event.stopPropagation();
            }}
            icon={<DeleteOutlined />}
          >
            Закінчити маршрут
          </Button>
        </Popconfirm>
      </div>
    </Card>
  );
};

export default RouteCard;
