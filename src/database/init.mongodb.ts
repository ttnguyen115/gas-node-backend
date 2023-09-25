import mongoose from "mongoose";
// import {countConnect, checkOverload} from "../helpers/checkConnection";
import config from "../configs/configMongodb";

const {
  db: { username, password, host },
} = config;
const connectionMongoUrl = `mongodb+srv://${username}:${password}@${host}`;

class Database {
  static instance: Database;

  constructor() {
    this.connect();
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  connect(dbType = "mongodb") {
    mongoose.set("debug", true);
    mongoose.set("debug", { color: true });

    mongoose
      .connect(connectionMongoUrl)
      .then((_) => {
        console.log(`Connected Mongodb success::${connectionMongoUrl}`);
        // countConnect()
        // checkOverload()
      })
      .catch((err) =>
        console.log(`Error connection to MongoDB::${connectionMongoUrl}`),
      );
  }
}

const instanceMongodb = Database.getInstance();
export default instanceMongodb;
