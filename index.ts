import express, { Express } from "express";
import dotenv from "dotenv"
import * as database from "./config/database"
import clientRoutes from "./routes/client/index.route";

const app: Express = express();
const port: number | string = 3000;

dotenv.config(); // load biến môi trường từ file .env

database.connect(); // kết nối database



app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.use(express.static(`${__dirname}/public`));

clientRoutes(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
