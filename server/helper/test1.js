export function test1(data){
    const r= transformTimestamps(data)
    return r
}

function transformTimestamps(timestamps) {
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