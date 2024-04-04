import prisma from "./lib/prisma";
import config from "./config";
import appBuilder from "./app";

const { port } = config;

const app = appBuilder(prisma);

app.listen(port, () => console.log(`App running on http://localhost:${port}.`));
