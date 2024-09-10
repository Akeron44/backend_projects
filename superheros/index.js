const express = require("express");
const Joi = require("joi");
const Superhero = require("./models/superhero");

const app = express();

app.use(express.json());

app.get("/superheroes", async (req, res) => {
  const superheroes = await Superhero.find();
  res.send(superheroes);
});

app.get("/superheroes/:id", async (req, res) => {
  const superhero = await Superhero.findById(req.params.id);
  res.send(superhero);
});

app.post("/superheroes", async (req, res) => {
  const { error } = validateInput(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const superhero = new Superhero({
    name: req.body.name,
    power: req.body.power,
  });
  try {
    const result = await superhero.save();
    res.status(200).send(result);
  } catch (ex) {
    res.status(500).send("Internal Server Error");
  }
});

// UPDATE
app.patch("/superheroes/:id", async (req, res) => {
  const { error } = validateUpdateInput(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const superhero = await Superhero.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        power: req.body.power,
      },
      { new: true }
    );
    res.send(superhero);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

// DELETE
app.delete("/superheroes/:id", async (req, res) => {
  try {
    const superhero = await Superhero.findByIdAndDelete(req.params.id);
    if (!superhero) {
      return res
        .status(404)
        .send("The superhero with the given ID was not found.");
    }
    res.send(superhero);
  } catch (ex) {
    res.status(500).send("Internal Server Error");
  }
});

// HELPER FUNCTIONS
function validateInput(input) {
  const schema = {
    name: Joi.string().min(2).required(),
    power: Joi.string().min(5).required(),
  };

  const result = Joi.validate(input, schema);

  return result;
}

function validateUpdateInput(input) {
  const schema = Joi.object({
    name: Joi.string().min(2).optional(),
    power: Joi.string().min(5).optional(),
  }).or("name", "power");

  return schema.validate(input);
}

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(port));
