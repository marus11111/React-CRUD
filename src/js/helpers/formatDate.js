export default (timestamp, type) => {
  let dateObject = new Date(timestamp * 1000);
  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let monthIso = `0${dateObject.getMonth() + 1}`.substr(-2);
  let dayIso = `0${dateObject.getDate()}`.substr(-2);
  let ordinal = (() => {
    let day = dayIso;
    let ord = 'th';
    if (day[0] !== '1') {
      (day[1] === '1') && (ord = 'st');
      (day[1] === '2') && (ord = 'nd');
      (day[1] === '3') && (ord = 'rd');
    }
    return ord;
  })();
  let date = {};

  if (type === 'comment') {
    let minutes = `0${dateObject.getMinutes()}`;
    date.display = `${months[dateObject.getMonth()]} ${dateObject.getDate()}${ordinal} ${dateObject.getFullYear()} ${dateObject.getHours()}:${minutes.substr(-2)}`;
    date.iso = `${dateObject.getFullYear()}-${monthIso}-${dayIso}T${dateObject.getHours()}:${minutes.substr(-2)}`;
  } else if (type === 'post') {
    date.display = `${months[dateObject.getMonth()]} ${dateObject.getDate()}${ordinal} ${dateObject.getFullYear()}`;
    date.iso = `${dateObject.getFullYear()}-${monthIso}-${dayIso}`;
  }

  return date;
}
