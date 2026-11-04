import express from "express"
import dotenv from "dotenv"

dotenv.config();

const app = express();
const PORT = process.env.PORT;

if(!PORT)
{
    throw new Error("Port not found");
}

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});