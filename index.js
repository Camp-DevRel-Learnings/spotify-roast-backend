const express = require("express");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const { fetchSpotifyTracks, generateRoast } = require("./service");


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 25, 
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.set("trust proxy", 1 /* number of proxies between user and server */);
app.use(limiter);

app.get("/roast/:wallet", async (req, res) => {
  const wallet = req.params.wallet;
  const {username, tracks} = await fetchSpotifyTracks(wallet);
  const roast = await generateRoast(username, tracks);

  res.send({
    roast,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
