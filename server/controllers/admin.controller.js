import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import asyncHandler from "../middlewares/async.midleware.js";
import { convertDayJsToString } from "../utils/dayjs.js";
import {
  validateAndConvertPositiveInteger,
  isValidType,
  ValidateAndConvertDate,
} from "../utils/validation-admin.js";
import {
  getGroupType,
  convertGroupDateToString,
} from "../utils/dateReport-admin.js";
import dayjs from "dayjs";
export const getAllUsers = async (req, res, next) => {
  try {
    const list = await User.find();

    if (list.length > 0) {
      return res.status(200).json({
        success: true,
        message: "List of Users",
        data: {
          users: list,
        },
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "There is no Users",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const list = await Product.find();

    if (list.length > 0) {
      return res.status(200).json({
        success: true,
        message: "List of Products",
        data: {
          products: list,
        },
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "There is no Products",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const list = await Order.aggregate([
      {
        $lookup: {
          from: "orderitems", // Collection to join with
          localField: "orderItems", // Array of ObjectId references in 'order'
          foreignField: "_id", // The field in 'orderitems' collection to match
          as: "orderItemsDetails", // Output array field with joined data
        },
      },
    ]);

    if (list.length > 0) {
      return res.status(200).json({
        success: true,
        message: "List of Orders",
        data: {
          orders: list,
        },
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "There is no Orders",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getRevenue = asyncHandler(async (req, res, next) => {
  //By Date to Date
  //param: fromDate, toDate, type, limit, page

  try {
    const { fromDate, toDate } = await ValidateAndConvertDate({
      fromDateReq: req.query.fromDate,
      toDateReq: req.query.toDate,
    });

    await isValidType(req.query.type);
    const limit = await validateAndConvertPositiveInteger(
      req.query.limit,
      "Limit"
    );
    const page = await validateAndConvertPositiveInteger(
      req.query.page,
      "Page"
    );

    let groupType = {
      _id: {},
      total: { $sum: "$priceAfterDiscount" },
    };
    groupType = getGroupType({ groupType, type: req.query.type });

    const revenue = await Order.aggregate([
      {
        $match: {
          paidAt: {
            $gte: fromDate.toDate(),
            $lte: toDate.toDate(),
          },
        },
      },
      {
        $group: groupType,
      },
      {
        $facet: {
          metadata: [{ $count: "total" }], // Get total document count
          data: [
            { $sort: { _id: 1 } },
            { $skip: req.query.type !== "total" ? (page - 1) * limit : 0 },
            { $limit: limit },
          ],
        },
      },
    ]);

    let result;
    if (req.query.type === "total") {
      result = { revenue: revenue[0].data[0]?.total || 0 };
    } else {
      result = revenue[0].data.map((rev) => ({
        date: convertGroupDateToString({ data: rev._id, type: req.query.type }),
        revenue: rev.total || 0,
      }));
    }

    res.status(200).json({
      success: true,
      message: `Revenue from ${req.query.fromDate} to ${
        req.query.toDate ??
        convertDayJsToString({ date: dayjs(), format: "DD-MM-YYYY" })
      } `,
      data: result,
      totalPages: Math.ceil(revenue[0].metadata[0]?.total / limit) || 1,
    });
  } catch (error) {
    next(error);
  }
});

const getTopProducts = async ({ fromDate, toDate, limitProduct, sortBy }) => {
  return await Order.aggregate([
    {
      $match: {
        paidAt: {
          $gte: fromDate.toDate(),
          $lte: toDate.toDate(),
        },
      },
    },
    { $unwind: "$orderItems" }, // Unwind the orderItems array
    {
      $group: {
        _id: {
          productId: "$orderItems.product",
          name: "$orderItems.name",
        },
        quantity: { $sum: "$orderItems.quantity" }, // Sum product quantity
      },
    },
    {
      $sort: { quantity: sortBy === "asc" ? 1 : -1 }, // Sort by quantity
    },
    {
      $limit: limitProduct, // Take the top 'N' highest/lowest products
    },
  ]);
};

const getTopProductsByDate = async ({
  fromDate,
  toDate,
  limitProduct,
  sortBy,
  type,
  limit,
  page,
}) => {
  //Group type date
  let groupType = {
    _id: { productId: "$orderItems.product", name: "$orderItems.name" },
    totalQuantity: { $sum: "$orderItems.quantity" },
  };
  groupType = getGroupType({ groupType, type });

  //Products list
  const productIds = await getTopProducts({
    fromDate,
    toDate,
    limitProduct,
    sortBy,
  }).then((res) => res.map((product) => product._id.productId));

  //Order quantity by date
  return await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $match: {
        paidAt: {
          $gte: fromDate.toDate(),
          $lte: toDate.toDate(),
        },
        "orderItems.product": { $in: productIds }, // Filter only top products
      },
    },
    {
      $group: groupType, // Group type => handle "paidAt"
    },
    {
      $group: {
        _id: {
          day: "$_id.day",
          month: "$_id.month",
          quarter: "$_id.quarter",
          year: "$_id.year",
        },
        products: {
          $push: {
            productId: "$_id.productId",
            name: "$_id.name",
            quantity: "$totalQuantity", // Now summed correctly
          },
        },
      },
    },

    {
      $facet: {
        metadata: [{ $count: "totalDocuments" }], // Get total count of documents
        data: [
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1,
              "_id.day": 1,
              "_id.quarter": 1,
            },
          },
          { $skip: !type === "total" ? (page - 1) * limit : 0 },
          { $limit: limit },
        ],
      },
    },
  ]);
};

export const getProductsQuantity = asyncHandler(async (req, res, next) => {
  //param: fromDate, toDate, type, limitProduct, limit, page, sort

  try {
    const { fromDate, toDate } = await ValidateAndConvertDate({
      fromDateReq: req.query.fromDate,
      toDateReq: req.query.toDate,
    });

    await isValidType(req.query.type);
    const limitProduct = await validateAndConvertPositiveInteger(
      req.query.limitProduct,
      "Limit Product"
    );
    const limit = await validateAndConvertPositiveInteger(
      req.query.limit,
      "Limit"
    );
    const page = await validateAndConvertPositiveInteger(
      req.query.page,
      "Page"
    );

    const topProducts = await getTopProducts({
      fromDate,
      toDate,
      limitProduct,
      sortBy: req.query.sortBy,
    });

    const topProductsByDate = await getTopProductsByDate({
      fromDate,
      toDate,
      limitProduct,
      sortBy: req.query.sortBy,
      type: req.query.type,
      limit,
      page,
    });

    let result = [];
    if (req.query.type === "total") {
      result = topProducts.map((item) => {
        return {
          productId: item._id.productId,
          name: item._id.name,
          quantity: item.quantity,
        };
      });
    } else {
      result = topProductsByDate[0].data.map((item) => {
        return {
          date: convertGroupDateToString({
            data: item._id,
            type: req.query.type,
          }),
          productQuantity: topProducts.map((t) => {
            return {
              productId: t._id.productId,
              name: t._id.name,
              quantity:
                item.products.find((p) => {
                  return p.productId.toString() === t._id.productId.toString();
                })?.quantity || 0,
            };
          }),
        };
      });
    }
    res.status(200).json({
      success: true,
      message: `Products quantity from ${req.query.fromDate} to ${
        req.query.toDate ??
        convertDayJsToString({ date: dayjs(), format: "DD-MM-YYYY" })
      }`,
      data: result,
      totalPages: Math.ceil(
        Math.ceil(topProductsByDate[0]?.metadata[0]?.totalDocuments / limit) ||
          1
      ),
    });
  } catch (error) {
    next(error);
  }
});

export const getCustomer = asyncHandler(async (req, res, next) => {
  //param: fromDate, toDate, type, limit, page

  try {
    const { fromDate, toDate } = await ValidateAndConvertDate({
      fromDateReq: req.query.fromDate,
      toDateReq: req.query.toDate,
    });

    await isValidType(req.query.type);
    const limit = await validateAndConvertPositiveInteger(
      req.query.limit,
      "Limit"
    );
    const page = await validateAndConvertPositiveInteger(
      req.query.page,
      "Page"
    );

    let groupType = {
      _id: {},
      uniqueUsers: { $addToSet: "$user" },
    };
    groupType = getGroupType({ groupType, type: req.query.type });

    const numberOfCustomers = await Order.aggregate([
      {
        $match: {
          paidAt: {
            $gte: fromDate.toDate(),
            $lte: toDate.toDate(),
          },
        },
      },
      {
        $group: groupType, // Group by your criteria
      },
      {
        $project: {
          _id: 1,
          count: { $size: "$uniqueUsers" }, // Count unique users per group
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }], // Get total count of documents
          data: [
            { $sort: { _id: 1 } }, // Sort by count (Descending)
            { $skip: req.query.type !== "total" ? (page - 1) * limit : 0 },
            { $limit: limit },
          ],
        },
      },
    ]);

    let result;
    if (req.query.type === "total") {
      result = { customers: numberOfCustomers[0].data[0]?.count || 0 };
    } else {
      result = numberOfCustomers[0].data.map((item) => {
        return {
          date: convertGroupDateToString({
            data: item._id,
            type: req.query.type,
          }),
          customers: item.count || 0,
        };
      });
    }

    res.status(200).json({
      success: true,
      message: `Number of Customers from ${req.query.fromDate} to ${
        req.query.toDate ??
        convertDayJsToString({ date: dayjs(), format: "DD-MM-YYYY" })
      } `,
      data: result,
      totalPages:
        Math.ceil(numberOfCustomers[0].metadata[0]?.total / limit) || 1,
    });
  } catch (error) {
    next(error);
  }
});
