export async function  sales_transformer(data){
    const array=await transformTimestamps(data)
    const day= await sales_by_day(array)
    const year=await sales_by_year(array)
    const month=await sales_by_month(array)
    const quater=await sales_by_quarter(array)
    const growth=await calculateSalesGrowth(array)
    const anotherGrowth=await cumulativeSales(array)
    // console.log("day",day);
    // console.log("year",year);
    // console.log("month",month);
    // console.log("quater",quater);
    // console.log("growth",growth);
    console.log("anothergrowth",anotherGrowth);

return {day,quater,month,year,growth,anotherGrowth}
}

async function transformTimestamps(timestamps) {
    return timestamps.map(item => {
        const date = new Date(item.created_at);
        
        const day = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        const month = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        const year = `${date.getFullYear()}`;
        const amount=parseInt(item.total_price_set.shop_money.amount)

        return {
            day,
            month,
            year,
            amount
        };
    });
}

async function sales_by_day(data) {
    const salesByDay = data.reduce((acc, curr) => {
        if (!acc[curr.day]) {
            acc[curr.day] = 0;
        }
        acc[curr.day] += curr.amount;
        return acc;
    }, {});

    const x = Object.keys(salesByDay);
    const y = Object.values(salesByDay);

    return { x, y };
}

async function sales_by_year(data) {
    const salesByYear = data.reduce((acc, curr) => {
        if (!acc[curr.year]) {
            acc[curr.year] = 0;
        }
        acc[curr.year] += curr.amount;
        return acc;
    }, {});

    const x = Object.keys(salesByYear);
    const y = Object.values(salesByYear);

    return { x, y };
}

async function sales_by_month(data) {
    const salesByMonth = data.reduce((acc, curr) => {
        if (!acc[curr.month]) {
            acc[curr.month] = 0;
        }
        acc[curr.month] += curr.amount;
        return acc;
    }, {});

    const x = Object.keys(salesByMonth);
    const y = Object.values(salesByMonth);

    return { x, y };
}

function getQuarter(month) {
    if (month >= 1 && month <= 3) return 'Q1';
    if (month >= 4 && month <= 6) return 'Q2';
    if (month >= 7 && month <= 9) return 'Q3';
    if (month >= 10 && month <= 12) return 'Q4';
}

async function sales_by_quarter(data) {
    const salesByQuarter = data.reduce((acc, curr) => {
        const date = new Date(curr.day.split('/').reverse().join('-')); // Convert DD/MM/YYYY to Date object
        const quarter = `${getQuarter(date.getMonth() + 1)}/${date.getFullYear()}`;

        if (!acc[quarter]) {
            acc[quarter] = 0;
        }
        acc[quarter] += curr.amount;
        return acc;
    }, {});

    const x = Object.keys(salesByQuarter);
    const y = Object.values(salesByQuarter);

    return { x, y };
}

async function calculateSalesGrowth(data) {
    // Step 1: Calculate daily totals
    const dailyTotals = data.reduce((acc, curr) => {
        if (!acc[curr.day]) {
            acc[curr.day] = 0;
        }
        acc[curr.day] += curr.amount;
        return acc;
    }, {});

    // Step 2: Calculate cumulative sales
    const days = Object.keys(dailyTotals).sort((a, b) => new Date(a.split('/').reverse().join('-')) - new Date(b.split('/').reverse().join('-')));
    let cumulativeSales = 0;
    const cumulativeSalesByDay = days.map(day => {
        cumulativeSales += dailyTotals[day];
        return { day, cumulativeSales };
    });

    // Step 3: Calculate growth rate and format result
    const x = [];
    const y = [];
    cumulativeSalesByDay.forEach((entry, index, arr) => {
        if (index === 0) {
            x.push(entry.day);
            y.push(0); // No growth rate for the first day
        } else {
            const previousCumulativeSales = arr[index - 1].cumulativeSales;
            const growthRate = ((entry.cumulativeSales - previousCumulativeSales) / previousCumulativeSales) * 100;
            x.push(entry.day);
            y.push(growthRate);
        }
    });

    return { x, y };
}

async function cumulativeSales(data) {
    // Step 1: Calculate daily totals
    const dailyTotals = data.reduce((acc, curr) => {
        if (!acc[curr.day]) {
            acc[curr.day] = 0;
        }
        acc[curr.day] += curr.amount;
        return acc;
    }, {});

    // Step 2: Calculate cumulative sales
    const days = Object.keys(dailyTotals).sort((a, b) => new Date(a.split('/').reverse().join('-')) - new Date(b.split('/').reverse().join('-')));
    let cumulativeSales = 0;
    const cumulativeSalesByDay = days.map(day => {
        cumulativeSales += dailyTotals[day];
        return { day, cumulativeSales };
    });

    // Step 3: Format result in x and y arrays
    const x = cumulativeSalesByDay.map(entry => entry.day);
    const y = cumulativeSalesByDay.map(entry => entry.cumulativeSales);

    return { x, y };
}