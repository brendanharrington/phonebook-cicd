import Person from "../../server/models/person.js";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const persons = await Person.find({});
      return res.status(200).json(persons);
    }

    if (req.method === "POST") {
      const { name, number } = req.body || {};

      if (!name || !number) {
        return res.status(400).json({ error: "name or number missing" });
      }

      const person = new Person({ name, number });
      const saved = await person.save();
      return res.status(201).json(saved);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    // Let Mongoose validation errors surface as 400 with message
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: "internal server error" });
  }
}
