import Person from "../../../server/models/person.js";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  try {
    if (method === "GET") {
      const person = await Person.findById(id);
      if (person) {
        return res.status(200).json(person);
      }
      return res.status(404).end();
    }

    if (method === "PUT") {
      const { name, number } = req.body || {};
      const updated = await Person.findByIdAndUpdate(
        id,
        { name, number },
        { new: true, runValidators: true, context: "query" },
      );

      if (updated) {
        return res.status(200).json(updated);
      }
      return res.status(404).end();
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
