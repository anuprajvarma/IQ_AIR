export function getFormattedLocalDateTime(
  dt: number,
  timezone: number
): string {
  const localUnixTime = dt + timezone;
  const date = new Date(localUnixTime * 1000);

  const day: number = date.getDate(); // No leading zero
  const month: string = date.toLocaleString("default", { month: "short" }); // e.g., "May"

  // 12-hour time formatting
  let hours: number = date.getHours();
  const minutes: string = date.getMinutes().toString().padStart(2, "0");
  const ampm: string = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 => 12

  const formattedTime: string = `${hours}:${minutes}${ampm}`;
  const formattedDate: string = `${month} ${day}, ${formattedTime}`;

  return formattedDate;
}
