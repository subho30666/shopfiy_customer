import React from "react";
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Total_sales_over_time from "./Total_sales_over_time";
import Sales_growth_rate_over_time from "./Sales_growth_rate_over_time";
import New_customers_added_over_time from "./New_customers_added_over_time";
import No_of_repeat_customer from "./No_of_repeat_customer";
import Geo_dis_of_customers from "./Geo_dis_of_customers";
import Customers_lifetime from "./Customers_lifetime";
import Home from "./Home";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="total_sales" element={<Total_sales_over_time />} />
          <Route
            path="sales_growth"
            element={<Sales_growth_rate_over_time />}
          />
          <Route
            path="new_customers"
            element={<New_customers_added_over_time />}
          />
          <Route
            path="no_of_repeat_customers"
            element={<No_of_repeat_customer />}
          />
          <Route
            path="geo_dis_of_customers"
            element={<Geo_dis_of_customers />}
          />
          <Route path="customers_lifetime" element={<Customers_lifetime />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
