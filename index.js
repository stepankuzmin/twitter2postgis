const pgp = require("pg-promise")();
const Twit = require("twit");
require("dotenv").load();

const options = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000 // optional HTTP request timeout to apply to all requests.
};

const bot = new Twit(options);

const Moscow = ["37.290501", "55.491306", "37.96743", "55.957699"];
const stream = bot.stream("statuses/filter", { locations: Moscow });

const connection = {
  host: process.env.POSTGRESQL_HOST,
  port: process.env.POSTGRESQL_PORT,
  database: process.env.POSTGRESQL_DATABASE,
  user: process.env.POSTGRESQL_USER,
  password: process.env.POSTGRESQL_PASSWORD
};

const db = pgp(connection);

const save = async tweet => {
  try {
    const values = [
      tweet.id_str,
      tweet.text,
      tweet.user.name,
      tweet.user.screen_name,
      tweet.user.profile_image_url,
      tweet.coordinates,
      tweet.created_at
    ];
    await db.none(
      "INSERT INTO twitter (id, text, user_name, user_screen_name, user_profile_image_url, geom, created_at) VALUES ($1, $2, $3, $4, $5, st_setsrid(ST_GeomFromGeoJSON($6), 4326), $7)",
      values
    );
    console.log(`${tweet.user.name}: ${tweet.text}`);
  } catch (e) {
    console.error(e);
  }
  // pgp.end();
};

stream.on("tweet", tweet => {
  if (tweet.coordinates) {
    save(tweet);
  }
});
