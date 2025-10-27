import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { to as copyTo } from "pg-copy-streams";
import { layouts } from "../layouts/layouts.mjs";
import { createWriteStream } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.join(__dirname, "files.json");

async function gerarArquivo(client, nomeArquivo, sql) {
  const tempDir = path.join(__dirname, "../temp");
  await fs.mkdir(tempDir, { recursive: true }); 

  const filePath = path.join(tempDir, nomeArquivo);

  const stream = client.query(copyTo(sql));
  const fileStream = createWriteStream(filePath);

  return new Promise((resolve, reject) => {
    stream.pipe(fileStream);

    fileStream.on("finish", () => {
      console.log(`${nomeArquivo} gerado em ${filePath}`);
      resolve();
    });

    stream.on("error", (err) => {
      console.error(`Erro ao gerar ${nomeArquivo}:`, err);
      reject(err);
    });

    fileStream.on("error", (err) => {
      console.error(`Erro ao escrever ${nomeArquivo}:`, err);
      reject(err);
    });
  });
}

export async function gerarArquivos(client) {
  try {
    const arquivosData = await fs.readFile(jsonPath, "utf-8");
    const arquivosMap = JSON.parse(arquivosData);

    const promessas = Object.entries(arquivosMap).map(async ([nome, chave]) => {
      const sql = layouts[chave];
      if (!sql) {
        console.warn(`Query SQL não encontrada para a chave: ${chave}`);
        return;
      }

      try {
        await gerarArquivo(client, nome, sql);
      } catch (err) {
        console.error(`Erro ao gerar ${nome}:`, err);
      }
    });

    await Promise.all(promessas);
    console.log("✅ Todos os arquivos foram gerados com sucesso em ../temp/");
  } catch (err) {
    console.error("Erro ao ler o arquivo de mapeamento JSON:", err);
  }
}
