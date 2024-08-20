import React,{useState,useEffect,useRef} from 'react'
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function Repeat() {
    const [daily,setDaily]=useState([])
    const [monthly,setMonthly]=useState([])
    const [quaterly,setQuaterly]=useState([])
    const [yearly,setYearly]=useState([])
    useEffect(() => {
        const fetchData = async () => {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/repeat`);
          const data = await response.json();
          processSalesData(data);
        };
    
        const processSalesData = (data) => {
            let daily_repeat = arrayToXY(data.daily_repeat)
            let monthly_repeat = arrayToXY(data.monthly_repeat)
            let quaterly_repeat = arrayToXY(data.quarterly_repeat)
            let yearly_repeat = arrayToXY(data.yearly_repeat)
         setDaily(daily_repeat)
         setMonthly(monthly_repeat)
         setQuaterly(quaterly_repeat)
         setYearly(yearly_repeat)
          return 
        };
    
        fetchData();
      }, []);

  return (
    <div>
    <RepeatChart label='Daily repeat customers' data={daily}/>
    <RepeatChart label='Monthly repeat customers' data={monthly}/>
    <RepeatChart label='Quaterly repeat customers' data={quaterly}/>
    <RepeatChart label='Yearly repeat customers' data={yearly}/>
  </div>
  )
  
}

export default Repeat

const RepeatChart = ({ label, data }) => {
    const options = {
      chart: {
        type: "column",
      },
      title: {
        text: label,
      },
      xAxis: {
        categories: data.x,
      },
      yAxis: {
        title: {
          text: "No.of Repeat Customers",
        },
      },
      series: [
        {
          name: "No.of Repeat Customers",
          data: data.y,
          color: "#7cb5ec",
        },
       
      ],
      colors: [
       '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
            '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
      ],
      plotOptions: {
        column: {
          colorByPoint: true,
        },
      },
    };
  
    return (
      <div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    );
  };

  function arrayToXY(arr) {
    let result = { x: [], y: [] };
    for (let key in arr) {
        if (arr.hasOwnProperty(key)) {
            result.x.push(key);
            result.y.push(arr[key]);
        }
    }
    return result;
}
