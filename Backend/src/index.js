import dotenv from "dotenv";
import  connect  from "./database/connect.js";
import { app } from "./app.js";

dotenv.config({
    path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

connect()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(
                `Server is running on port ${process.env.PORT || 8000}`
            );
        });
    })
    .catch((error) => {
        console.log(`Mongodb connection failed : ${error}`);
        process.exit(1);
    });
