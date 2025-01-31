import express from "express";
import bodyParser from "body-parser";
import pg from "pg";


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client ({
  user: "postgres",
  host: "localhost",
  database: "Travel Tracker",
  password: "Viswa200412345!",
  port : 5432
});

db.connect();


app.post("/add", async (req, res) => {
  const input = req.body["country"].trim().toUpperCase();
  console.log(input);
  if(!input) {
    return res.redirect("/?error=Invalid country name");
  }
  try{
    const checkResult = await db.query("SELECT country_code FROM visited_country WHERE country_code = $1",[input]);
    if (checkResult.rows.length > 0) {
      return res.redirect("/?error=Repeated Country name");
    }
    await db.query("INSERT INTO visited_country (country_code) VALUES ($1)",[input]);
    let countries = [];
    for(var i = 0; i < result.rows.length; i++) {
    countries.push(result.rows[i].country_code);
    }
    res.redirect("/");
  console.log(result);
  console.log(countries);
  console.log(result.rows);
  } 
  catch(err) {
    console.error("Error adding country:", err.message);
      res.redirect("/?error=Repeated Country name");   
  }
  
});

app.get("/", async (req, res) => {
  const result = await db.query("SELECT country_code FROM visited_country");
  const error = req.query.error;
  let countries = [];
  for(var i = 0; i < result.rows.length; i++) {
    countries.push(result.rows[i].country_code);
  }
  console.log(countries);
  console.log(result.rows);
  console.log(error);
  res.render("index.ejs", {countries: countries, total: countries.length, error: error});
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
