import { createExpressAdapter } from "@axeom/express";
import Axeom from "@axeom/framework";
import express from "express";

const legacyServer = express();

legacyServer.get("/legacy", (req, res) => {
  res.send("Legacy route is working.");
});

const axeom = new Axeom();

axeom.get("/modern", () => ({
  status: "weightless",
  engine: "Axeom v0.2.0",
  integration: "success",
}));

legacyServer.use("/api", createExpressAdapter(axeom as any).app);

legacyServer.listen(3002, () => {
  console.log("\nEXPRESS INTEGRATION TEST");
  console.log("----------------------------");
  console.log("1. Test Legacy:  http://localhost:3002/legacy");
  console.log("2. Test Axeom:   http://localhost:3002/api/modern");
  console.log("----------------------------\n");
});
