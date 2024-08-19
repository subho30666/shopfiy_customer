import React,{useState,useEffect}  from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMap from 'highcharts/modules/map';
import mapDataUSA from '@highcharts/map-collection/countries/us/us-all.geo.json';
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



const Customer = () => {
    const [newCustomers,setNewCustomer]=useState([])
    const [newCustomers_growth,setNewCustomer_growth]=useState([])
    const [city,setCity]=useState([])

    useEffect(() => {
        const fetchData = async () => {
          const response = await fetch("http://localhost:3001/api/customers/");
          const data = await response.json();
          processSalesData(data);
        };
    
        const processSalesData = (data) => {
           setNewCustomer(data.new_customer)
           setNewCustomer_growth(data.new_customer_growth)
           setCity(data.city1)
          return 
        };
    
        fetchData();
      }, []);

      
  return (
    <>
    
    <CustomerGrowthChart  label='New Customer added over time' data={newCustomers} data1={newCustomers_growth} />
   
    <OrdersHeatmap data={city}/>
    
    <OrdersBubbleChart data={city}/>
    </>
  )
}

export default Customer



const CustomerGrowthChart = ({ label, data,data1=[] }) => {

    

    const options = {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: label
        },
        xAxis: {
            categories: data.x,
            crosshair: true
        },

        yAxis: [{
            title: {
                text: 'Number of Customers'
            }
        }],
        series: [{
            type: 'column',
            name: 'Customers Added (Bar)',
            data: data.y,
            color: '#90ed7d'
        }, {
            type: 'line',
            name: 'Customer Growth (Area)',
            data: data1.y,
            color: '#f45b5b',
            fillOpacity: 0.5
        }],
        colors: ['#90ed7d', '#f45b5b', '#7cb5ec', '#434348', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#91e8e1'],
        plotOptions: {
            column: {
                colorByPoint: true
            },
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

HighchartsMap(Highcharts);

const OrdersHeatmap = ({ data }) => {
    // Transform the data into the format required by Highcharts
    const heatmapData = data.map(item => ({
        'hc-key': `us-${item.state.toLowerCase()}`,
        value: item.count
    }));

    const options = {
        chart: {
            map: mapDataUSA
        },
        title: {
            text: 'Number of Orders by States'
        },
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },
        colorAxis: {
            min: 0,
            stops: [
                [0, '#EFEFFF'],
                [0.5, '#4444FF'],
                [1, '#000022']
            ]
        },
        series: [{
            type: 'map',
            name: 'Orders',
            data: heatmapData,
            joinBy: ['hc-key', 'hc-key'],
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }],
        tooltip: {
            formatter: function () {
                return `<b>${this.point.name}</b><br>Orders: <b>${this.point.value}</b>`;
            }
        }
    };

    return (
        <div>
            <HighchartsReact highcharts={Highcharts} constructorType={'mapChart'} options={options} />
        </div>
    );
};

const OrdersBubbleChart = ({ data }) => {
    // Transform the data into the format required by Highcharts
    const bubbleData = data.map((item, index) => ({
        name: item.city,
        x: index,
        y: item.count,
        z: item.count
    }));

    const options = {
        chart: {
            type: 'bubble',
            plotBorderWidth: 1,
            zoomType: 'xy'
        },
        title: {
            text: 'Number of Orders by City'
        },
        xAxis: {
            categories: data.map(item => item.city),
            title: {
                text: 'City'
            }
        },
        yAxis: {
            title: {
                text: 'Number of Orders'
            }
        },
        series: [{
            name: 'Orders',
            data: bubbleData,
            colorByPoint: true
        }],
        tooltip: {
            formatter: function () {
                return `<b>${this.point.name}</b><br>Orders: <b>${this.point.y}</b>`;
            }
        }
    };

    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};


