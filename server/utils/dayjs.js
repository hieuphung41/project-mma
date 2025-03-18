import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import advancedFormat from "dayjs/plugin/advancedFormat.js";

dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

const convertStringToDayJs = ({ date, format = null }) => {
  return {
    isValid: dayjs(date, format, true).isValid(),
    data: format ? dayjs(date, format) : dayjs(date),
  };
};
const convertDayJsToString = ({ date, format = null }) => {
  return format ? date.format(format) : date.toString();
};

const getDatesInRange = ({ from, to, type }) => {
  const start = dayjs(from);
  const end = dayjs(to);
  const diff = end.diff(start, type);

  let format, unit;

  switch (type) {
    case "day":
      format = "DD-MM-YYYY";
      unit = "day";
      break;
    case "month":
      format = "MM-YYYY";
      unit = "month";
      break;
    case "year":
      format = "YYYY";
      unit = "year";
      break;
    case "quarter":
      format = "[Q]Q-YYYY";
      unit = "quarter";
      break;
  }

  return Array.from({ length: diff + 1 }, (_, i) => {
    if (unit === "quarter") {
      return start.add(i * 4, "month").format(format);
    }
    return start.add(i, unit).format(format);
  });
};
export { convertStringToDayJs, convertDayJsToString, getDatesInRange };
