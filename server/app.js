import express from "express";
import { PORT } from "./config/env.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// Import the routers
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import categoryRouter from "./routes/category.routes.js";
import brandRouter from "./routes/brand.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import checkoutRouter from "./routes/checkout.routes.js";
import addressRouters from "./routes/address.routes.js";
import couponRouter from "./routes/coupon.routes.js";
import adminRouter from "./routes/admin.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:8081", "http://localhost:5173"],
    credentials: true,
  })
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/checkout", checkoutRouter);
app.use("/api/v1/address", addressRouters);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/admin", adminRouter);
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Welcom to the SDN with Thopn3");
});

app.listen(PORT, async () => {
  console.log(`listening on http://localhost:${PORT}`);

  await connectToDatabase();
});

export default app;
