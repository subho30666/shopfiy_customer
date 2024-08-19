import React from 'react'
import { AppBar, Toolbar, Typography, Grid, Paper } from '@mui/material';
import Orders from './orders';
import Customer from './customer';
import Cohort from './cohort'

function Home() {
  return (
    <>
    <Dashboard/>
    </>
  )
}

export default Home


const Dashboard = () => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Shopify Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <Grid container spacing={3} style={{ padding: 24 }}>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: 16 }}>
            <Typography variant="h6">Chart 1</Typography>
            {/* Highcharts component will go here */}
            <Orders/>

          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: 16 }}>
            <Typography variant="h6">Chart 2</Typography>
            {/* Highcharts component will go here */}
            <Customer/>
            <Cohort/>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};