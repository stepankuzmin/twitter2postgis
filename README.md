# Twitter 2 PostGIS

Example app that saves twits with location into PostGIS database

## Usage

Create table with following columns:

```sql
create table twitter (id varchar primary key, text varchar, user_name varchar, user_screen_name varchar, user_profile_image_url varchar, created_at timestamp, geom geometry(point, 4326));
```

Create `.env` file with corresponding variables:

`TWITTER_CONSUMER_KEY`
`TWITTER_CONSUMER_SECRET`
`TWITTER_ACCESS_TOKEN`
`TWITTER_ACCESS_TOKEN_SECRET`
`POSTGRESQL_HOST`
`POSTGRESQL_PORT`
`POSTGRESQL_DATABASE`
`POSTGRESQL_USER`
`POSTGRESQL_PASSWORD`

Run app

```shell
yarn
npm start
```
