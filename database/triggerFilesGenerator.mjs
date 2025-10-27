import { Client } from "pg";
import { gerarArquivos as fileGen } from "../generators/fileGenerator.mjs";

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT),
});

  (async () => {
    try {
      console.log(
        `Tentando conectar: ${process.env.DB_USER}, ${process.env.DB_HOST}, ${process.env.DB_NAME}, ${process.env.DB_PASS}, ${process.env.DB_PORT}`
      );
      await client.connect();
      await fileGen(client);
    } catch (err) {
      console.error("Erro ao gerar arquivos: ", err);
    } finally {
      await client.end();
    }
  })();

