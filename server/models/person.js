import mongoose from "../db.js";

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: function(v) {
        const parts = v.split("-");

        if (parts.length !== 2) {
          return false;
        }

        const [first, second] = parts;

        if (!/^\d{2,3}$/.test(first)) {
          return false;
        }

        if (!/^\d+$/.test(second)) {
          return false;
        }

        return true;
      },
      message: props => `${props.value} is not a valid phone number!`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model("Person", personSchema);