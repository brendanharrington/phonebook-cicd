import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";

mongoose.set("strictQuery", false);

mongoose.connect(MONGODB_URI)
  .then(() => console.info("connected to MongoDB"))
  .catch(err => console.error("error connecting to MongoDB:", err.message));

export default mongoose;