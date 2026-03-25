import express, { Express } from "express";
import dotenv from "dotenv"
import path from "path";
import * as database from "./config/database"
import clientRoutes from "./routes/client/index.route";
import adminRoutes from "./routes/admin/index.route";
import { systemConfig } from "./config/system";

const app: Express = express();
const port: number | string = 3000;

dotenv.config(); // load biến môi trường từ file .env

database.connect(); // kết nối database

// App local Variable
app.locals.prefixAdmin = systemConfig.prefixAdmin

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

clientRoutes(app);
adminRoutes(app);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
