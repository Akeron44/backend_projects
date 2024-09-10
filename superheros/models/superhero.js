const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/superheroes")
  .then(() => console.log("Connecting to SuperheroesMongoDB"))
  .catch((err) => console.log(err.message));

const superheroSchema = new mongoose.Schema({
  name: { type: String, required: true },
  power: { type: String, required: true },
});

const Superhero = mongoose.model("Superhero", superheroSchema);

module.exports = Superhero;
