import express from "express";

const app = express();

app.get("/", (req, res) => res.send("Ура пришел запрос!"));
app.get("/users", (req, res) => res.send("Ура пришел запрос на users!"));
app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  res.send(`Пришел запрос на users/${id}`);
});

app.listen(8000, () => console.log("Сервер запущен на порту 8000"));
