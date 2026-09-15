// prettier-ignore
const monthData = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"]
const days = [
  "Monday",
  "Tuesday",
  "Wenesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const parseServerActionResponse = <T>(response: T) => {
  return JSON.parse(JSON.stringify(response));
};

export const starLogoutTimer = function () {
  let min;
  let sec;
  const tick = function () {
    min = String(Math.trunc(time / 60)).padStart(2, "0");
    sec = String(time % 60).padStart(2, "0");
    if (time === 0) {
      clearInterval(timer);
    }
    time--;
  };
  let time = 30;
  tick();
  const timer = setInterval(tick, 1000);
  return { timer, min, sec };
};

export const formattedDateTime = (date: Date | string) => {
  const inputDate = new Date(date);

  const originalHour = inputDate.getUTCHours();
  const minute = inputDate.getUTCMinutes();

  const period = originalHour >= 12 ? "PM" : "AM";

  const hour = originalHour % 12 || 12;

  return `${inputDate.getUTCDate()} ${
    monthData[inputDate.getUTCMonth()]
  }, ${days[inputDate.getUTCDay()]} - ${(hour + 1)
    .toString()
    .padStart(2, "0")}:${minute.toString().padStart(2, "0")} ${period}`;
};

export const formattedAmount = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

export const formattedTransAmount = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};
