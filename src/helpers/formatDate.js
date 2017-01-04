export default (timestamp, type) => {
    let dateObject = new Date(timestamp * 1000);
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let monthIso = `0${dateObject.getMonth() + 1}`.substr(-2);
    let dayIso = `0${dateObject.getDate()}`.substr(-2);
    let date = {};
    
    if (type === 'comment') {
        let minutes = `0${dateObject.getMinutes()}`;
        date.display = `${dateObject.getDay() + 1} ${months[dateObject.getMonth()]} ${dateObject.getFullYear()} ${dateObject.getHours()}:${minutes.substr(-2)}`;
        date.iso = `${dateObject.getFullYear()}-${monthIso}-${dayIso}T${dateObject.getHours()}:${minutes.substr(-2)}`;
    }
    else if (type === 'post') {
        date.display = `${dateObject.getDay() + 1} ${months[dateObject.getMonth()]} ${dateObject.getFullYear()}`;
        date.iso = `${dateObject.getFullYear()}-${monthIso}-${dayIso}`;
    }
    
    return date;
}