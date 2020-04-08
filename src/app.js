const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, resp) => {
  return resp.json(repositories);
});

app.post("/repositories", (req, resp) => {
  const { title, url, techs } = req.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return resp.json(repository);
});

app.put("/repositories/:id", (req, resp) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  if (!isUuid(id)) {
    return resp.status(400).json({ error: 'Id invalid' });
  }

  const repositoryIndex = repositories.findIndex(rep => rep.id === id);

  if (repositoryIndex < 0) {
    return resp.status(400).json({ error: 'Repository not found' });
  }

  const updateRepository = {
    id,
    title: title? title : repositories[repositoryIndex].title,
    url: url? url : repositories[repositoryIndex].url,
    techs: techs? techs : repositories[repositoryIndex].techs,
    likes: 0
  }

  repositories[repositoryIndex] = updateRepository;

  return resp.json(updateRepository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: 'Id invalid' });
  }
  
  const repositoryIndex = repositories.findIndex(rep => rep.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found' });
  }

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, resp) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return resp.status(400).json({ error: 'Id invalid' });
  }

  const repositoryIndex = repositories.findIndex(rep => rep.id === id);

  if (repositoryIndex < 0) {
    return resp.status(400).json({ error: 'Repository not found' });
  }

  repositories[repositoryIndex].likes += 1;

  return resp.json({ likes: repositories[repositoryIndex].likes });
});

module.exports = app;
