import { Client } from "pg";
import { fileGen } from "../generators/fileGenerator.mjs";

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT),
});

  (async () => {
    try {
      await client.connect();
      await fileGen(client);
    } catch (err) {
      console.error("Erro ao gerar arquivos: ", err);
    } finally {
      await client.end();
    }
  })();

