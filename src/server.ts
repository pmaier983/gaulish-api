import express from "express";
import postgraphile from "postgraphile";

const app = express();

const {
  RDS_USER,
  RDS_PASSWORD,
  RDS_HOST,
  RDS_DATABASE,
  GRAPHQL_PORT,
} = process.env;

app.use(
  postgraphile(
    `postgres://${RDS_USER}:${RDS_PASSWORD}@${RDS_HOST}/${RDS_DATABASE}`,
    "public",
    {
      watchPg: true,
      graphiql: true,
      enhanceGraphiql: true,
    }
  )
);

app.listen(GRAPHQL_PORT, () =>
  console.log(`Server running at http://localhost:${GRAPHQL_PORT}/graphiql`)
);