const bodyParser = require('body-parser');
const expess = require('express');
const dbConnect = require('./config/dbConnect');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const app = expess();
const dotenv =require('dotenv').config();
const PORT =process.env.PORT || 4000;
const authRouter = require("./routes/authRoute");
const cookieParser = require("cookie-parser");
const productRouter = require("./routes/productRoute");
const doctorRouter = require("./routes/doctorRoute");
const blogRouter = require("./routes/blogRoute");
const prescriptionRouter = require("./routes/prescriptionRoute")
const categoryRouter = require("./routes/prodcategoryRoute");
const blogcategoryRouter = require("./routes/blogCatRoute");
const brandRouter = require("./routes/brandRoute");
const specializeRouter = require("./routes/specializeRoute");
const enqRouter = require("./routes/enqRoute");
const colorRouter = require("./routes/colorRoute");
const couponRouter = require("./routes/couponRoute");
const morgan = require("morgan");
const cors = require("cors");

dbConnect();

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.use("/api/user",authRouter);
app.use("/api/product",productRouter);
app.use("/api/doctor",doctorRouter);
app.use("/api/blog",blogRouter);
app.use("/api/category",categoryRouter);
app.use("/api/blogcategory",blogcategoryRouter);
app.use("/api/brand",brandRouter);
app.use("/api/specialize",specializeRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/color", colorRouter);
app.use("/api/prescription",prescriptionRouter);
app.use("/api/enquiry", enqRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT,() =>{
    console.log(`Server is running at PORT ${PORT}`);
});