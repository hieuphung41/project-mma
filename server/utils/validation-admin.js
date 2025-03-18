import dayjs from "dayjs";
import { convertStringToDayJs } from "./dayjs.js";

export const ValidateAndConvertDate = ({ fromDateReq, toDateReq }) => {
  if (!fromDateReq) {
    const error = new Error("From Date is required");
    error.statusCode = 400;
    throw error;
  }

  let toDate;
  if (!toDateReq) {
    toDate = {
      isValid: true,
      data: dayjs(),
    };
  } else {
    toDate = convertStringToDayJs({
      date: toDateReq,
      format: "DD-MM-YYYY",
    });
  }

  const fromDate = convertStringToDayJs({
    date: fromDateReq,
    format: "DD-MM-YYYY",
  });

  if (!fromDate.isValid || !toDate.isValid) {
    const error = new Error("Invalid date format");
    error.statusCode = 400;
    throw error;
  }

  if (!fromDate.data.isBefore(toDate.data)) {
    const error = new Error("Invalid date range");
    error.statusCode = 400;
    throw error;
  }

  return { isvalid: true, fromDate: fromDate.data, toDate: toDate.data };
};

export const isValidType = (type) => {
  if (!type) {
    const error = new Error("Type is required");
    error.statusCode = 400;
    throw error;
  }

  if (!["year", "quarter", "month", "day", "total"].includes(type)) {
    const error = new Error("Invalid type");
    error.statusCode = 400;
    throw error;
  }
};

export const validateAndConvertPositiveInteger = (stringNum, name) => {
  if (!stringNum) {
    const error = new Error(name + " is required");
    error.statusCode = 400;
    throw error;
  }

  const num = parseInt(stringNum);

  if (isNaN(num)) {
    const error = new Error(name + " must be an Integer");
    error.statusCode = 400;
    throw error;
  }

  if (num <= 0) {
    const error = new Error(name + " must be greater than 0");
    error.statusCode = 400;
    throw error;
  }

  return num;
};
