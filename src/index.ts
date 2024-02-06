import express, { Request } from "express";
import { NotFoundException } from "./exceptions/NotFoundException";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import cookieParser from "cookie-parser";
import { Exception } from "./exceptions";

import jwt from "jsonwebtoken";
import { authMiddleware } from "./middlewares/authMiddleware";

const app = express();

app.use(express.json());
app.use(cookieParser());

const users = [
  { id: 1, email: "test@test.ru", name: "test", password: "12345" },
  { id: 2, email: "test2@test.ru", name: "test2", password: "qwerty" },
  { id: 3, email: "test3@test.ru", name: "test3", password: "67890" },
];

const generateTokensPair = (payload: Record<string, any>) => {
  const accessToken = jwt.sign(payload, "secret-key", {
    expiresIn: "3m",
  });
  const refreshToken = jwt.sign(payload, "secret-key", {
    expiresIn: "1d",
  });

  return { accessToken, refreshToken };
};

app.post("/auth/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = users.find((user) => user.email === email);

  if (!user) {
    throw new NotFoundException("Юзер с таким email не найден");
  }

  if (user.password !== password) {
    throw new Exception(
      401,
      "Неверный пароль",
      `Неправильный пароль для юзера ${user.email}`
    );
  }

  const { accessToken, refreshToken } = generateTokensPair({ userId: user.id });

  res.send({ accessToken });
  res.cookie("refreshToken", refreshToken);
});

app.post("/auth/refresh", (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;

  try {
    const decoded = jwt.verify(oldRefreshToken, "secret-key");

    const { accessToken, refreshToken } = generateTokensPair(decoded as any);

    res.send({ accessToken });
    res.cookie("refreshToken", refreshToken);
  } catch (e) {
    throw new Exception(401, (e as any).message);
  }
});

app.get(
  "/users/me",
  authMiddleware,
  (req: Request & { userId?: number }, res) => {
    const userId = req.userId as number;
    const user = users.find((user) => user.id === userId);

    if (!user) {
      throw new NotFoundException("Нет такого юзера");
    }

    res.send(user);
  }
);

app.get("/users", (req, res) => {
  res.send(users);
});

app.use(errorMiddleware);

app.listen(8080, () => console.log("Сервер запущен на порту 8080"));
