import express from 'express'
import graphqlHTTP from 'express-graphql'
import MyGraphQLSchema from './MyGraphQLSchema'
import {
  graphql
} from 'graphql'

const app = express()
 
app.use(
  '/graphql',
  graphqlHTTP({
    schema: MyGraphQLSchema,
    graphiql: true,
  }),
)

app.get('/api/movies', (req, res, next) => {
  let query = `
    {
      movies {
        id,
        title,
        genres,
        rating,
        theater {
          id,
          name,
          comments {
            id,
            content
          }
        },
        comments {
          id,
          content
        }
      }
    }
  `
  graphql(MyGraphQLSchema, query)
    .then((result) => {
      res.json(result.data.movies)
    })
})
 
app.listen(4400)