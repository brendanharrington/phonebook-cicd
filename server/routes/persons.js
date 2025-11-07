import express from "express";
import Person from "../models/person.js";

const router = express.Router();

router.get("/", (req, res) => {
  Person.find({}).then(persons => res.json(persons));
});

router.get("/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      } 
    })
    .catch(next);
});

router.post("/", (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "name or number missing" });
  }

  const person = new Person({ name, number });
  return person.save()
    .then(saved => res.json(saved))
    .catch(next);
});

router.put("/:id", (req, res, next) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" },
  )
    .then(updated => updated ? res.json(updated) : res.status(404).end())
    .catch(next);
});

router.delete("/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(next);
});

export default router;
