export async function cohort_transformer(data){
    const array = await transformTimestamps(data)
    const cohort=await groupByCohort(array)
    return {cohort}
}

async function transformTimestamps(timestamps) {
    return timestamps.map(item => {
        const date = new Date(item.created_at);
        
        const day = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        const month = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        const year = `${date.getFullYear()}`;
        const first_name=item.customer.first_name
        const last_name=item.customer.last_name
        const full_name=`${first_name} ${last_name}`
       const email=item.email
       const price=item.total_price


        return {
            day,
            month,
            year,
            first_name,
            last_name,
            full_name,
           email,
           price
        };
    });
}

async function groupByCohort(data) {
    // Helper function to parse date and get month-year string
    const getMonthYear = (dateStr) => {
        const date = new Date(dateStr.split('/').reverse().join('-'));
        return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}`;
    };

    // Create a map to store cohorts
    const cohorts = {};

    // Process each entry in the data
    data.forEach(entry => {
        const cohortMonth = getMonthYear(entry.day);
        const email = entry.email;
        const price = parseFloat(entry.price);

        // Initialize cohort if not already present
        if (!cohorts[cohortMonth]) {
            cohorts[cohortMonth] = {};
        }

        // Initialize customer data if not already present
        if (!cohorts[cohortMonth][email]) {
            cohorts[cohortMonth][email] = {
                full_name: entry.full_name,
                total_spent: 0,
                first_purchase: entry.day
            };
        }

        // Update total spent by the customer
        cohorts[cohortMonth][email].total_spent += price;
    });

    // Convert cohorts map to an array for easier use with Highcharts
    const cohortArray = Object.keys(cohorts).map(cohortMonth => {
        const customers = Object.values(cohorts[cohortMonth]);
        const totalRevenue = customers.reduce((sum, customer) => sum + customer.total_spent, 0);
        const averageCLV = totalRevenue / customers.length;

        return {
            cohortMonth,
            customers,
            lifetime_value: averageCLV
        };
    });

    return cohortArray;
}