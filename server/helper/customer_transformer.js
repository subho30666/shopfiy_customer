
export async function customer_transformer(data){
    const array = await transformTimestamps(data)
    const new_customer=await getNewCustomersOverTime(array)
    const new_customer_growth=await getCumulativeCustomersOverTime(array)
    const city=await groupByCities(array)
    const city1=await groupByCities1(array)
    // const dailyRepeatCustomers = await getRepeatCustomers(array, 'daily');
    // const monthlyRepeatCustomers = await getRepeatCustomers(array, 'monthly');
    // const quarterlyRepeatCustomers = await getRepeatCustomers(array, 'quarterly');
    // const yearlyRepeatCustomers = await getRepeatCustomers(array, 'yearly');
    // console.log("dailyrepeat",dailyRepeatCustomers);

    return {new_customer,new_customer_growth,array,city,city1,/* dailyRepeatCustomers,monthlyRepeatCustomers,quarterlyRepeatCustomers,yearlyRepeatCustomers */}
}

async function transformTimestamps(timestamps) {
    return timestamps.map(item => {
        const date = new Date(item.created_at);
        
        const day = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        const month = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        const year = `${date.getFullYear()}`;
        const first_name=item.first_name
        const last_name=item.last_name
        const full_name=`${item.first_name} ${item.last_name}`
        const city=item.default_address.city
        const province=item.default_address.province
        const country=item.default_address.country
        const zip=item.default_address.zip


        return {
            day,
            month,
            year,
            first_name,
            last_name,
            full_name,
            city,
            province,
            country,
            zip
        };
    });
}
async function getNewCustomersOverTime(data) {
    // Step 1: Extract Dates and Count New Customers
    const customersByDate = data.reduce((acc, customer) => {
        const date = customer.day;
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date]++;
        return acc;
    }, {});

    // Step 2: Format Result
    const x = Object.keys(customersByDate).sort();
    const y = x.map(date => customersByDate[date]);

    return { x, y };
}

async function getCumulativeCustomersOverTime(data) {
    // Step 1: Extract Dates and Count New Customers
    const customersByDate = data.reduce((acc, customer) => {
        const date = customer.day;
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date]++;
        return acc;
    }, {});

    // Step 2: Calculate Cumulative Customers
    const x = Object.keys(customersByDate).sort();
    let cumulativeCount = 0;
    const y = x.map(date => {
        cumulativeCount += customersByDate[date];
        return cumulativeCount;
    });

    return { x, y };
}

async function groupByCities(data) {
    // Step 1: Group by city and count customers
    const customersByCity = data.reduce((acc, customer) => {
        const city = customer.city;
        const state = customer.province;
        if (!acc[city]) {
            acc[city] = 0;
        }
        acc[city]++;
        return acc;
    }, {});

    // Step 2: Prepare result
    const result = Object.keys(customersByCity).map(city => ({
        city,
        count: customersByCity[city]
    }));

    return result;
}

async function groupByCities1(data) {
    // Step 1: Group by city and count customers
    const customersByCity = data.reduce((acc, customer) => {
        const city = customer.city;
        const state = customer.province.toLowerCase();
        if (!acc[city]) {
            acc[city] = { count: 0, state: state };
        }
        acc[city].count++;
        return acc;
    }, {});

    console.log("reslut",customersByCity);
    // Step 2: Prepare result
    const result = Object.keys(customersByCity).map(city => ({
        city,
        state: customersByCity[city].state,
        count: customersByCity[city].count
    }));

    return result;
}

async function getRepeatCustomers(data, timeFrame) {
    // Helper function to format date based on time frame
    function formatDate(date, timeFrame) {
        const d = new Date(date);
        switch (timeFrame) {
            case 'daily':
                return d.toISOString().split('T')[0]; // YYYY-MM-DD
            case 'monthly':
                return `${d.getFullYear()}-${d.getMonth() + 1}`; // YYYY-MM
            case 'quarterly':
                return `${d.getFullYear()}-Q${Math.floor(d.getMonth() / 3) + 1}`; // YYYY-QN
            case 'yearly':
                return d.getFullYear().toString(); // YYYY
            default:
                return d.toISOString().split('T')[0];
        }
    }

    // Step 1: Group by customer and time frame
    const purchasesByCustomer = data.reduce((acc, purchase) => {
        const customer = purchase.full_name;
        const timeKey = formatDate(purchase.day, timeFrame);
        if (!acc[customer]) {
            acc[customer] = {};
        }
        if (!acc[customer][timeKey]) {
            acc[customer][timeKey] = 0;
        }
        acc[customer][timeKey]++;
        return acc;
    }, {});

    // Step 2: Identify repeat customers
    const repeatCustomers = Object.keys(purchasesByCustomer).filter(customer => {
        return Object.values(purchasesByCustomer[customer]).some(count => count > 1);
    });

    return repeatCustomers;
}