import Person from "../../server/models/person.js";
import connectToDatabase from "../../server/connect.js";

export default async function handler(req, res) {
  // Vercel provides parsed query params on req.query for dynamic routes in most runtimes,
  // but provide a fallback by parsing the URL so we always get the id.
  const method = req.method;
  const idFromQuery = req.query && req.query.id;
  let id = idFromQuery;
  if (!id) {
    try {
      const raw = req.url || "";
      const path = raw.split("?")[0];
      id = path.split("/").filter(Boolean).pop();
    } catch {
      id = undefined;
    }
  }

  // Debug logging to help diagnose 404s in dev
  console.info(`[api/persons/[id]] ${method} ${req.url} -> id=${id}`);

  try {
    await connectToDatabase();
    if (method === "GET") {
      const person = await Person.findById(id);
      if (person) {
        return res.status(200).json(person);
      }
      return res.status(404).json({ error: "person not found" });
    }

    if (method === "PUT") {
      const { name, number } = req.body || {};
      console.info(`[api/persons/[id]] request body for id=${id}:`, req.body);
      // Log whether the document exists before attempting update
      try {
        const exists = await Person.exists({ _id: id });
        console.info(`[api/persons/[id]] exists check for id=${id}:`, exists);
      } catch (e) {
        console.warn(`[api/persons/[id]] exists check failed for id=${id}:`, e?.message || e);
      }

      const updated = await Person.findByIdAndUpdate(
        id,
        { name, number },
        { new: true, runValidators: true, context: "query" },
      );

      console.info(`[api/persons/[id]] findByIdAndUpdate result for id=${id}:`, updated);

      if (updated) {
        return res.status(200).json(updated);
      }
      return res.status(404).json({ error: "person not found" });
    }

    if (method === "DELETE") {
      await Person.findByIdAndDelete(id);
      return res.status(204).end();
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: "internal server error" });
  }
}
