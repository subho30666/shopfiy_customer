export async function repeat_transformer(data) {
const array =await transformTimestamps(data)
const daily_repeat=await countRepeatCustomersPerDay(array)
const monthly_repeat=await countRepeatCustomersPerMonth(array)
const yearly_repeat=await countRepeatCustomersPerYear(array)
const quarterly_repeat=await countRepeatCustomersPerQuarter(array)
    return {daily_repeat,monthly_repeat,yearly_repeat,quarterly_repeat}
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


        return {
            day,
            month,
            year,
            first_name,
            last_name,
            full_name,
           email
        };
    });
}

async function countRepeatCustomersPerDay(data) {
    const customerVisits = {};
    const repeatCustomersPerDay = {};

    data.forEach(({ email, day }) => {
        if (!customerVisits[email]) {
            customerVisits[email] = new Set();
        }

        if (customerVisits[email].size > 0) {
            if (!repeatCustomersPerDay[day]) {
                repeatCustomersPerDay[day] = 0;
            }
            repeatCustomersPerDay[day] += 1;
        }

        customerVisits[email].add(day);
    });

    return repeatCustomersPerDay;
}

async function countRepeatCustomersPerMonth(data) {
    const customerVisits = {};
    const repeatCustomersPerMonth = {};

    data.forEach(({ email, month }) => {
        if (!customerVisits[email]) {
            customerVisits[email] = new Set();
        }

        if (customerVisits[email].size > 0) {
            if (!repeatCustomersPerMonth[month]) {
                repeatCustomersPerMonth[month] = 0;
            }
            repeatCustomersPerMonth[month] += 1;
        }

        customerVisits[email].add(month);
    });

    return repeatCustomersPerMonth;
}

async function countRepeatCustomersPerYear(data) {
    const customerVisits = {};
    const repeatCustomersPerYear = {};

    data.forEach(({ email, year }) => {
        if (!customerVisits[email]) {
            customerVisits[email] = new Set();
        }

        if (customerVisits[email].size > 0) {
            if (!repeatCustomersPerYear[year]) {
                repeatCustomersPerYear[year] = 0;
            }
            repeatCustomersPerYear[year] += 1;
        }

        customerVisits[email].add(year);
    });

    return repeatCustomersPerYear;
}

function getQuarter(month) {
    const monthNumber = parseInt(month.split('/')[0], 10);
    return Math.ceil(monthNumber / 3);
}

async function countRepeatCustomersPerQuarter(data) {
    const customerVisits = {};
    const repeatCustomersPerQuarter = {};

    data.forEach(({ email, month, year }) => {
        const quarter = `Q${getQuarter(month)}/${year}`;

        if (!customerVisits[email]) {
            customerVisits[email] = new Set();
        }

        if (customerVisits[email].size > 0) {
            if (!repeatCustomersPerQuarter[quarter]) {
                repeatCustomersPerQuarter[quarter] = 0;
            }
            repeatCustomersPerQuarter[quarter] += 1;
        }

        customerVisits[email].add(quarter);
    });

    return repeatCustomersPerQuarter;
}
