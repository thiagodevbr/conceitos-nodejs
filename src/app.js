const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const verifyRepository = (req, res, next) => {
  const { id } = req.params;
  const index = repositories.findIndex((repo) => repo.id === id);
  if (index >= 0) return next();
  else return res.status(400).json({ error: "Repository does not exists" });
};

app.use("/repositories/:id", verifyRepository);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const data = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(data);
  return response.json(data);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const index = repositories.findIndex((repo) => repo.id === id);
  const { likes } = repositories[index];
  repositories[index] = {
    id: id,
    title,
    url,
    techs,
    likes,
  };
  return response.json(repositories[index]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex((repo) => repo.id === id);
  repositories.splice(index, 1);
  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex((repo) => repo.id === id);
  repositories[index].likes++;
  return response.json(repositories[index]);
});

module.exports = app;
