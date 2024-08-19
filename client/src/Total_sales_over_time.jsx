import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import dayjs from "dayjs";
import { LineChart } from "@mui/x-charts/LineChart";

function Total_sales_over_time() {
  const [dailySalesData, setDailySalesData] = useState([]);
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [quarterlySalesData, setQuarterlySalesData] = useState([]);
  const [yearlySalesData, setYearlySalesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3001/api/orders/");
      const data = await response.json();
      processSalesData(data);
    };

    const processSalesData = (data) => {
      return data;
    };

    fetchData();
  }, []);

  return (
    <>
      {/* <ChartComponent title="Daily Sales" data={dailySalesData} /> */}
      <ChartComponent title="Total Monthly Sales" data={monthlySalesData} />
      <ChartComponent title="Total Quarterly Sales" data={quarterlySalesData} />
      <ChartComponent title="Total Yearly Sales" data={yearlySalesData} />
    </>
  );
}

export default Total_sales_over_time;

const ChartComponent = ({ title, data }) => {
  const xAxisData = data.map((prev) => prev.x);
  console.log("xaxis", xAxisData);
  const seriesData = data.map((prev) => prev.y);
  console.log("xaxis", seriesData);

  const options = {
    title: {
      text: title,
    },
    xAxis: {
      categories: xAxisData,
    },
    series: [
      {
        name: "Data",
        data: seriesData,
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};
