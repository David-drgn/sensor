import express from "express";
import cors from 'cors';    

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5001;

console.log("Rodando")

app.get("/", (req, res) => {
    return res.json("hellow word");
});