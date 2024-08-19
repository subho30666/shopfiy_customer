
export async function customer_transformer(data){
    const array = await transformTimestamps(data)
    const new_customer=await getNewCustomersOverTime(array)
    const new_customer_growth=await getCumulativeCustomersOverTime(array)
    const city=await groupByCities(array)

    return {new_customer,new_customer_growth,array,city}
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