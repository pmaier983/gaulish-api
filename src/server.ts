import express from "express"
import passport from "passport"
import { graphqlHTTP } from "express-graphql"

import db from "@/database"
import { schema } from "./schema"
import { googleOAuthStrategy } from "./googleOAuth"

// TODO: GZIP response
// TODO: setup a dataLoader
// TODO: setup some database mocking (msw, json-server, etc?)

// Create a server:
const app = express()

app.use(passport.initialize())

passport.use(googleOAuthStrategy)
// TODO: change all of these to GRAPHQL (/graphql) url if possible!
app.get("/google/success", (req, res) => {
  // TODO: send back to home page with JWT?
  return res.send(`You're in Phillip`)
})

app.get("/google/failure", (req, res) => res.send(`No Touch!`))

app.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  })
)

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/google/success",
    failureRedirect: "/google/failure",
    session: false, // duplicate session false needed?
  })
)

// Use those to handle incoming requests:
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    context: {
      db,
    },
    // TODO is there a better pattern then this IIFE?
    ...(() => {
      if (process.env.NODE_ENV === "development")
        return {
          graphiql: true,
          customFormatErrorFn: (error) => ({
            message: error.message,
            locations: error.locations,
            stack: error.stack ? error.stack.split("\n") : [],
            path: error.path,
          }),
        }
    })(),
  })
)

// Start the server:
app.listen(8080, () =>
  console.log("Server started on port http://localhost:8080")
)
