import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connect = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );
        console.log(
            `Database :: Connection :: Successful :: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.log(`Error :: Database :: Connection :: Failed :: ${error}`);
        process.exit(1);
    }
};

export default connect ;
