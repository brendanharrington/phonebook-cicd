import express from "express";
import { errorHandler } from "./middleware/errorHandler.js";
import { unknownEndpoint } from "./middleware/unknownEndpoint.js";
import personsRouter from "./routes/persons.js";
import "./db.js"; 

const app = express();

app.use(express.static("dist"));
app.use(express.json());

app.get("/health", (_, res) => res.send("ok"));

app.get("/info", async (_, res) => {
  const count = await import("./models/person.js").then(m => m.default.countDocuments({}));
  res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`);
});

app.use("/api/persons", personsRouter);
app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
