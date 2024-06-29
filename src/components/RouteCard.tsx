import React from "react";
import { Card, Progress } from "antd";

interface LogoCardProps {
  percentage?: string;
  title: string;
  date: string;
  img_url: string;
  handleOpenCard: () => void;
}

const RouteCard: React.FC<LogoCardProps> = ({
  percentage,
  title,
  date,
  handleOpenCard,
  img_url,
}) => {
  return (
    <Card className="max-w-[350px] w-full" hoverable onClick={handleOpenCard}>
      <div className="flex flex-col items-center w-full gap-4 mb-4">
        <p className="font-bold text-[20px]">{title}</p>
        <p className="font-normal text-[16px]">{date}</p>
      </div>
      <div className="w-full h-[300px] flex justify-center items-center flex-col gap-4">
        <img src={img_url} className="w-full rounded-2xl" alt="" />
        <Progress percent={Number(percentage)} />
      </div>
    </Card>
  );
};

export default RouteCard;
