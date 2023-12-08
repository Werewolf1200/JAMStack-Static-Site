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

// Renderizar Archivos HTMl y MD
for (let file of files) {
    const filePath = path.join(pagesDir, file);
    let extName = path.extname(file);

    console.log(file, filePath, extName);

    if (extName === ".md" || extName === ".pug" || extName === ".html") {
        let fileName = path.basename(file, extName);
        console.log(fileName);

        app.get(`/${fileName}`, async (req, res) => {

            try {
                if (extName === ".pug") {
                    res.render(fileName);
                }

                if (extName === ".html") {
                    res.sendFile(filePath);
                }

                if (extName === ".md") {
                    let fileContent = await fs.readFile(filePath, "utf-8");
                    let { attributes: frontMatterAtribbutes, body } = fm(fileContent);

                    let contentHTML = markdownIt().render(body); // Convertir MD a HTML
                    res.render("layout-md", { ...attributes, contentHTML });
                }

            } catch (err) {
                res.status(404).render("error404");
            }
        })
    }
}

// Pagina Principal
app.get("/", (req, res) => {
    res.render("index");
});

// Error 404
app.use((req, res) => {
    res.status(404).render("error404")
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("dev"));
app.use(cookieParser());

app.listen(port, () => 
    console.log(`Sitio Web corriendo en http://localhost:${port}`)
);