import { PORT } from "./config.js";
import app from "./app.js";

app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`);
});
