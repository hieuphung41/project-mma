export const convertGroupDateToString = ({ data, type }) => {
  switch (type) {
    case "day":
      return `${String(data.day).padStart(2, "0")}-${String(
        data.month
      ).padStart(2, "0")}-${data.year}`;
    case "month":
      return `${String(data.month).padStart(2, "0")}-${data.year}`;
    case "year":
      return `${data.year}`;
    case "quarter":
      return `Q${data.quarter}-${data.year}`;
    default:
      return null;
  }
};

export const getGroupType = ({ groupType, type }) => {
  switch (type) {
    case "day":
      groupType._id.day = { $dayOfMonth: "$paidAt" };
    case "month":
      groupType._id.month = { $month: "$paidAt" };
    case "year":
      groupType._id.year = { $year: "$paidAt" };
      break;
    case "quarter":
      groupType._id.quarter = {
        $ceil: { $divide: [{ $month: "$paidAt" }, 3] },
      };
      groupType._id.year = { $year: "$paidAt" };
      break;
    default:
      break;
  }

  return groupType;
};
