import React,{useState,useEffect} from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import styled from 'styled-components';

const DashboardContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
    background-color: #f4f4f4;
`;

const ChartContainer = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;




function Orders() {
    const [dailySalesData, setDailySalesData] = useState([]);
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [quarterlySalesData, setQuarterlySalesData] = useState([]);
  const [yearlySalesData, setYearlySalesData] = useState([]);
  const [growthData, setGrowthData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3001/api/orders/");
      const data = await response.json();
      processSalesData(data);
    };

    const processSalesData = (data) => {
        setDailySalesData(data.day)
        setQuarterlySalesData(data.quater)
        setMonthlySalesData(data.month)
        setYearlySalesData(data.year)
        setGrowthData(data.anotherGrowth)
      return 
    };

    fetchData();
  }, []);

  return (
    <>
    <DashboardContainer>
    <ChartContainer>
        <SalesChart label="Daily Sales" data={dailySalesData} />
    </ChartContainer>
    <ChartContainer>
        <SalesChart label="Quarterly Sales" data={quarterlySalesData} />
    </ChartContainer>
    <ChartContainer>
        <SalesChart label="Monthly Sales" data={monthlySalesData} />
    </ChartContainer>
    <ChartContainer>
        <SalesChart label="Yearly Sales" data={yearlySalesData} />
    </ChartContainer>
</DashboardContainer>
    <ChartContainer>
        <GrowthChart label="Growth over time" data={growthData} />
    </ChartContainer>
    </>
  )
}

export default Orders

const SalesChart = ({ label, data }) => {
    const options = {
        chart: {
            type: 'column'
        },
        title: {
            text: label
        },
        xAxis: {
            categories: data.x
        },
        yAxis: {
            title: {
                text: 'Sales'
            }
        },
        series: [{
            name: 'Sales',
            data: data.y,
            color: '#7cb5ec'
        }, {
            type: 'line',
            name: 'Sales Trend',
            data: data.y,
            color: '#434348'
        }],
        colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],
        plotOptions: {
            column: {
                colorByPoint: true
            }
        }
    };

    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};


const GrowthChart = ({ label, data }) => {
    const options = {
        chart: {
            type: 'area'
        },
        title: {
            text: label
        },
        xAxis: {
            categories: data.x
        },
        yAxis: {
            title: {
                text: 'Cumulative Sales'
            }
        },
        series: [{
            type: 'area',
            name: 'Growth Over Time',
            data: data.y,
            color: '#f45b5b',
            fillOpacity: 0.5
        }, {
            type: 'line',
            name: 'Growth Line',
            data: data.y,
            color: '#434348'
        }],
        colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],
        plotOptions: {
            area: {
                fillOpacity: 0.5
            }
        }
    };

    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};