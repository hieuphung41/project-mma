import { Router } from "express";
const checkoutRouter = Router();
import {
  VNP_URL,
  VNP_API_URL,
  VNP_HASH_SECRET,
  VNP_TMN_CODE,
  VNP_RETURN_URL,
} from "../config/env.js";
import qs from "qs";
import crypto from "crypto";
import moment from "moment";

checkoutRouter.post("/create_payment_url", (req, res, next) => {
  process.env.TZ = "Asia/Ho_Chi_Minh";

  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");

  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let tmnCode = VNP_TMN_CODE;
  let secretKey = VNP_HASH_SECRET;
  let vnpUrl = VNP_URL;
  let returnUrl = VNP_RETURN_URL;
  let orderId = moment(date).format("DDHHmmss");
  let amount = req.body.amount;
  let bankCode = req.body.bankCode;

  let locale = req.body.language;
  if (locale === null || locale === "") {
    locale = "vn";
  }
  let currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  let signData = qs.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + qs.stringify(vnp_Params, { encode: false });
  res.json({
    code: "00",
    message: "Success",
    data: {
      paymentUrl: vnpUrl,
    },
  });
});

checkoutRouter.get("/vnpay_return", (req, res) => {
  let vnp_Params = req.query;

  // Lấy thông tin SecureHash từ query string
  let secureHash = vnp_Params["vnp_SecureHash"];
  // Xoá SecureHash và SecureHashType khỏi dữ liệu trả về để không phải ký lại
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  // Sắp xếp lại các tham số để chuẩn bị tính toán lại chữ ký
  vnp_Params = sortObject(vnp_Params);

  // Khai báo thông tin cần thiết để tạo chữ ký
  let tmnCode = VNP_TMN_CODE;
  let secretKey = VNP_HASH_SECRET;

  // Tính toán chữ ký từ các tham số
  let signData = qs.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  // Kiểm tra chữ ký
  if (secureHash === signed) {
    // Chữ ký hợp lệ, kiểm tra mã phản hồi của VNPay
    let vnp_ResponseCode = vnp_Params["vnp_ResponseCode"]; // Mã phản hồi từ VNPay

    // Kiểm tra nếu thanh toán thành công (VNPay trả mã phản hồi '00' khi thanh toán thành công)
    if (vnp_ResponseCode === "00") {
      res
        .status(200)
        .json({
          success: true,
          message: "Thanh toán thành công",
          code: vnp_ResponseCode,
        });
    } else {
      res
        .status(400)
        .json({
          sucess: false,
          message: "Thanh toán thất bại",
          code: vnp_ResponseCode,
        });
    }
  } else {
    // Chữ ký không hợp lệ
    res.send("Dữ liệu không hợp lệ, giao dịch không thành công");
  }
});

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

export default checkoutRouter;
