index.js
const express = require("express");
const db = require("@supabase/supabase-js");
const multer = require("multer");
const csv = require("csv-parser");
const path = require("path");
const fs = require("fs");


const app = express();
const upload = multer({ dest: "uploads/" });


const url = "https://riwircsryqgeloqwliii.supabase.co";
const api =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpd2lyY3NyeXFnZWxvcXdsaWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMyMjE2MzYsImV4cCI6MjAyODc5NzYzNn0.-_hVQ1cWDsUTgUmhWR5KlWXZmfmLyA9t70PFJcCzDow";
const supabase = db.createClient(url, api);


app.get("/", (req, res) => {
  res.send("Hello World");
});


app.get("/upload", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});


const uploadRoute = (req, res) => {
  const file = req.file;


  if (!file) {
    res.status(400).send("Nenhum arquivo foi enviado");
    return;
    }


    const results = [];


    fs.createReadStream(file.path)
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      try {
        const { data, error } = await supabase.from("usuario1").insert(results);
        if (error) {
          throw error;
        }
        console.log("Dados inseridos com sucesso:", data);
        res.status(200).send("Dados inseridos com sucesso");
      } catch (error) {
        console.error("Erro ao inserir dados:", error.message);
        res.status(500).send("Erro ao inserir dados");
      } finally {

        fs.unlink(file.path, (err) => {
          if (err) {
            console.error("Erro ao excluir arquivo temporário:", err);
          }
        });
      }
    });
    };


    app.post("/upload", upload.single("csvFile"), uploadRoute);


    app.listen(3000, () => {
    console.log("Executando....");
    });