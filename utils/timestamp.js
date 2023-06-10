export default function getDayTime() {
  let currentDay = new Date();
  let year = String(currentDay.getFullYear());
  let month = String(currentDay.getMonth() + 1);
  let day = String(currentDay.getDate());
  let hour = String(currentDay.getHours());
  let minutes = String(currentDay.getMinutes());
  let seconds = String(currentDay.getSeconds());

  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  let timestamp = year + month + day + hour + minutes + seconds;
  return timestamp;
}

// module.exports.getDayTime = getDayTime;
