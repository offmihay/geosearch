import React from "react";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

const StatisticsPage: React.FC = () => {
  return (
    <div className="">
      <RangePicker />
    </div>
  );
};

export default StatisticsPage;
