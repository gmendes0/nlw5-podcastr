const ONE_SECOND = 1;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;

export function covertDurationToTimeString(duration: number): string {
  const hours = Math.floor(duration / ONE_HOUR);
  const minutes = Math.floor((duration % ONE_HOUR) / ONE_MINUTE);
  const seconds = duration % ONE_MINUTE;

  const timeString = [hours, minutes, seconds]
    .map(unit => String(unit).padStart(2, "0"))
    .join(":");

  return timeString;
}
