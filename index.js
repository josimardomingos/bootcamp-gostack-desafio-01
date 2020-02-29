const express = require("express");
const server = express();

server.use(express.json());

/**
 * Banco de dados
 */
const projects = [];

// MIDDLEWARES

/**
 * Middleware que verifica se o projeto existe.
 */
checkIdExists = (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Project does not exists." });
  }

  req.projectId = id;

  return next();
};

/**
 * Middleware que contabiliza a quantidade de requisições.
 */
countRequests = (req, res, next) => {
  console.count("countRequests");

  return next();
};
// MIDDLEWARES - FIM

server.use(countRequests);

// ROUTES

/**
 * Lista todos os projetos.
 */
server.get("/projects", (req, res) => {
  return res.json(projects);
});

/**
 * Cadastra um novo projeto.
 * @bodyParam id string
 * @bodyParam title string
 */
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

/**
 * Altera o título de um projeto.
 * @routeParam id string
 * @bodyParam title string
 */
server.put("/projects/:id", checkIdExists, (req, res) => {
  const { title } = req.body;

  const project = projects.find(item => item.id === req.projectId);
  if (!project) {
    return res.status(400).json({ error: "Project does not exists." });
  }
  project.title = title;
  return res.json(project);
});

/**
 * Remove um projeto.
 * @routeParam id string
 */
server.delete("/projects/:id", checkIdExists, (req, res) => {
  const projectIndex = projects.findIndex(item => item.id === req.projectId);
  if (!projectIndex) {
    return res.status(400).json({ error: "Project does not exists." });
  }

  projects.splice(projectIndex, 1);

  return res.send();
});

/**
 * Cadastra uma tarefa para um projeto.
 * @routeParam id string
 * @bodyParam title string
 */
server.post("/projects/:id/tasks", checkIdExists, (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title of task does not exists" });
  }

  const project = projects.find(item => item.id === req.projectId);
  if (!project) {
    return res.status(400).json({ error: "Project does not exists." });
  }

  project.tasks.push(title);

  return res.json(project);
});
// ROUTES - FIM

server.listen(3000);
