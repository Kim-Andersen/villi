
const options: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: false
};

export default function formatDateTime(date: Date): string {
  try {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  } catch(error) {
    console.error(`Could not format date: ${date}`, error);
    return date.toString();
  }
}