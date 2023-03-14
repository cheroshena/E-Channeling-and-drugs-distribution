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
const blogRouter = require("./routes/blogRoute");
const morgan = require("morgan");


dbConnect();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.use("/api/user",authRouter);
app.use("/api/product",productRouter);
app.use("/api/blog",blogRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT,() =>{
    console.log(`Server is running at PORT ${PORT}`);
});