import express from "express";
import fs from "";
import path from "";
import { fileURLToPath } from "url"
import markdownIt from "markdown-it";
import fm from "front-matter";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();
const port = 3000;

const __dirname = fileURLToPath(new URL(".", import.meta.url));

app.set("views", path.join(__dirname, "pages"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public"))); // Directorio de los archivos estaticos pug

// Directorio de los archivos estaticos que no son pug
const pagesDir = path.join(__dirname, "pages");
const files = await fs.readdir(pagesDir);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("dev"));
app.use(cookieParser());

app.listen(port, () => 
    console.log(`Sitio Web corriendo en http://localhost:${port}`)
);