import React,{useState,useEffect} from 'react'
import Highcharts from 'highcharts';
import './CohortTable.css'
const Cohort = () => {
    const [cohort,setCohort]=useState([])
    useEffect(() => {
        const fetchData = async () => {
          const response = await fetch("http://localhost:3001/api/cohort");
          const data = await response.json();
          processSalesData(data);
        };
    
        const processSalesData = (data) => {
          setCohort(data.cohort)
          return 
        };
    
        fetchData();
      }, []);

  return (
    <div>
    <h1>Cohort Analysis</h1>
    <CohortChart cohorts={cohort} />
    <CohortTable cohorts={cohort} />
  </div>
  )
}

export default Cohort

const CohortTable = ({ cohorts }) => {
    const [openCohorts, setOpenCohorts] = useState({});
  
    const toggleCohort = (month) => {
      setOpenCohorts((prev) => ({
        ...prev,
        [month]: !prev[month]
      }));
    };
  
    const groupedCohorts = cohorts.reduce((acc, cohort) => {
      if (!acc[cohort.cohortMonth]) {
        acc[cohort.cohortMonth] = [];
      }
      acc[cohort.cohortMonth].push(cohort);
      return acc;
    }, {});
  
    return (
      <div className="table-container">
        <table className="cohort-table">
          <thead>
            <tr>
              <th>Cohort Month</th>
              <th>Show Details</th>
              <th>Lifetime Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedCohorts).map((month) => (
              <React.Fragment key={month}>
                <tr>
                  <td>{month}</td>
                  <td>
                    <button onClick={() => toggleCohort(month)}>
                      {openCohorts[month] ? 'Hide Details' : 'Show Details'}
                    </button>
                  </td>
                  <td>
                    {groupedCohorts[month].reduce((acc, cohort) => acc + cohort.lifetime_value, 0).toFixed(2)}
                  </td>
                </tr>
                {openCohorts[month] && (
                  <tr>
                    <td colSpan="3">
                      <div className="inner-table-container">
                        <h3 className="inner-table-title">Cohort Details for {month}</h3>
                        <table className="inner-table">
                          <thead>
                            <tr>
                              <th>Customer Name</th>
                              <th>Total Spent</th>
                              <th>First Purchase Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {groupedCohorts[month].flatMap((cohort) =>
                              cohort.customers.map((customer, idx) => (
                                <tr key={idx}>
                                  <td>{customer.full_name}</td>
                                  <td>{customer.total_spent}</td>
                                  <td>{customer.first_purchase}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  
  const CohortChart = ({ cohorts }) => {
    useEffect(() => {
      cohorts.forEach((cohort, index) => {
        Highcharts.chart(`chart-container-${index}`, {
          chart: {
            type: 'column'
          },
          title: {
            text: `Cohort Analysis for ${cohort.cohortMonth}`
          },
          xAxis: {
            categories: cohort.customers.map(customer => customer.full_name),
            title: {
              text: 'Customers'
            }
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Total Spent (USD)'
            }
          },
          series: [{
            name: 'Total Spent',
            data: cohort.customers.map(customer => customer.total_spent)
          }]
        });
      });
    }, [cohorts]);
  
    return (
      <div>
        {cohorts.map((cohort, index) => (
          <div key={index} id={`chart-container-${index}`} style={{ width: '100%', height: '400px' }}></div>
        ))}
      </div>
    );
  };
  
  