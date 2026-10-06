// date-format.js
export function formatDistanceToNow(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  if (seconds < 0) return "только что";
  
  const intervals = {
    год: 31536000,
    месяц: 2592000,
    день: 86400,
    час: 3600,
    минута: 60
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value);
    if (count >= 1) {
      if (unit === "минута") {
        if (count === 1) return "1 минуту назад";
        if (count >= 2 && count <= 4) return `${count} минуты назад`;
        return `${count} минут назад`;
      }
      if (unit === "час") {
        if (count === 1) return "1 час назад";
        if (count >= 2 && count <= 4) return `${count} часа назад`;
        return `${count} часов назад`;
      }
      if (unit === "день") {
        if (count === 1) return "вчера";
        if (count >= 2 && count <= 4) return `${count} дня назад`;
        return `${count} дней назад`;
      }
      if (unit === "месяц") {
        if (count === 1) return "месяц назад";
        return `${count} мес. назад`;
      }
      if (unit === "год") return "более года назад";
    }
  }
  return "только что";
}
