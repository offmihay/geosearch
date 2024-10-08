import React from "react";
import { Button, Card, Popconfirm, Progress } from "antd";
import { DeleteOutlined, MinusCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";

interface LogoCardProps {
  percentage?: string;
  title: string;
  date: string;
  img_url: string;
  handleOpenCard: () => void;
  onDelete: () => void;
  onDeactivate: () => void;
  countRoute: number;
  is_active: boolean;
  routes_done: number;
}

const RouteCard: React.FC<LogoCardProps> = ({
  percentage,
  title,
  date,
  handleOpenCard,
  img_url,
  onDelete,
  onDeactivate,
  countRoute,
  is_active,
  routes_done,
}) => {
  return (
    <Card
      className={`max-w-[355px] w-full relative ${!is_active ? "bg-black/30" : ""}`}
      hoverable
      onClick={() => is_active && handleOpenCard()}
    >
      <div className="flex flex-col items-center w-full gap-4 mb-4">
        <p className="font-bold text-[20px]">{`${title}`}</p>
        <p className="font-bold text-[20px]">{`${routes_done}/${countRoute}`}</p>
        <p className="font-normal text-[16px]">{date}</p>
      </div>
      <div className="w-full h-[400px] flex justify-center items-center flex-col gap-4 ">
        <div className="relative">
          <img src={img_url} className="w-full h-full rounded-2xl" alt="" />
          {!is_active && (
            <div
              className="absolute left-0 top-0 w-full h-full flex justify-center items-center bg-black/30 rounded-2xl"
              style={{ zIndex: 3 }}
            >
              <div className="">
                <img
                  src="https://i.ibb.co/N78F3VY/Png-Item-5287581.png"
                  className="w-full "
                  alt=""
                />
              </div>
            </div>
          )}
        </div>
        <Progress percent={Number(percentage)} />
        <Popconfirm
          title="Примусово завершити маршрут"
          description="Всі незроблені точки стануть активними на карті."
          icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          onConfirm={onDeactivate}
          onPopupClick={(event) => {
            event.stopPropagation();
          }}
          okText="Так"
          cancelText="Скасувати"
          overlayClassName="w-[300px]"
        >
          <Button
            type="primary"
            disabled={!is_active}
            onClick={(event) => {
              event.stopPropagation();
            }}
            icon={<MinusCircleOutlined />}
          >
            Деактивувати маршрут
          </Button>
        </Popconfirm>
        <Popconfirm
          title="Примусово видалити маршрут"
          description="Всі незроблені точки стануть активними на карті."
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
            danger
            type="primary"
            onClick={(event) => {
              event.stopPropagation();
            }}
            icon={<DeleteOutlined />}
          >
            Видалити маршрут
          </Button>
        </Popconfirm>
      </div>
    </Card>
  );
};

export default RouteCard;
