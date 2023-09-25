import mongoose from "mongoose";
import os from "os";
import process from "process";

const _SECONDS = 5000; // 5 seconds

const countConnect = () => {
  const numConnection: number = mongoose.connections.length;
  console.log(`Number of connections: ${numConnection}`);
};

const checkOverload = () => {
  setInterval(() => {
    const numConnection: number = mongoose.connections.length;
    const numCores: number = os.cpus().length;
    const memoryUsage: number = process.memoryUsage().rss;
    const maxConnections: number = numCores * 5;

    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);
    console.log(`Active connections:: ${numConnection}`);

    if (numConnection > maxConnections) {
      console.log("Connection overload detected!");
    }
  }, _SECONDS);
};

export { countConnect, checkOverload };
