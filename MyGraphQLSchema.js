import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull
} from 'graphql';

import axios from 'axios'

var MessageType = new GraphQLObjectType({
  name: 'MessageType',
  fields: {
    message: {
      type: GraphQLString
    }
  }
})

var CommentType = new GraphQLObjectType({
  name: 'CommentType',
  fields: {
    id: {
      type: GraphQLInt
    },
    subject: {
      type: GraphQLInt,
    },
    theaters: {
      type: GraphQLInt
    },
    content: {
      type: GraphQLString
    }
  }
})

var TheaterType = new GraphQLObjectType({
  name: 'TheaterType',
  fields: {
    id: {
      type: GraphQLInt
    },
    name: {
      type: GraphQLString
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve(obj, args, context) {
        return axios({
          url: 'http://localhost:3300/comments?theaters=' + obj.id
        })
        .then((result) => {
          return result.data
        })
      }
    }
  }
})

var MovieType = new GraphQLObjectType({
  name: 'MovieType',
  fields: {
    id: {
      type: GraphQLInt,
    },
    title: {
      type: GraphQLString
    },
    genres: {
      type: GraphQLString
    },
    rating: {
      type: GraphQLFloat
    },
    theater: {
      type: TheaterType,
      resolve(obj, args, context) {
        return axios({
          url: 'http://localhost:3300/theaters/' + obj.theater
        })
        .then((result) => {
          return result.data
        })
      }
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve(obj) {
        return axios({
          url: 'http://localhost:3300/comments?subject=' + obj.id
        })
        .then((result) => {
          return result.data
        })
      }
    }
  }
})
 
var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'world';
        },
      },
      movies: {
        type: new GraphQLList(MovieType),
        resolve() {
          return axios({
            url: 'http://localhost:3300/subjects'
          })
          .then((result) => {
            return result.data
          })
        }
      }
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      insert: {
        type: MovieType,
        args: {
          title: {
            type: new GraphQLNonNull(GraphQLString)
          },
          genres: {
            type: GraphQLString
          },
          rating: {
            type: GraphQLFloat
          },
          theater: {
            type: GraphQLInt
          }
        },
        resolve(obj, args) {
          return axios.post("http://localhost:3300/subjects", { ...args })
            .then((result) => {
              console.log(result)
              return result.data
            })
        }
      },

      update_put: {
        type: MovieType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          title: {
            type: new GraphQLNonNull(GraphQLString)
          },
          genres: {
            type: GraphQLString
          },
          rating: {
            type: GraphQLFloat
          },
          theater: {
            type: GraphQLInt
          }
        },
        resolve(obj, args) {
          return axios.put("http://localhost:3300/subjects/" + args.id, { ...args })
            .then((result) => {
              return result.data
            })
        }
      },

      update_patch: {
        type: MovieType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          title: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(obj, args) {
          return axios.patch("http://localhost:3300/subjects/" + args.id, { ...args })
            .then((result) => {
              return result.data
            })
        }
      },

      update_delete: {
        type: MessageType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve(obj, args) {
          return axios.delete("http://localhost:3300/subjects/" + args.id)
            .then((result) => {
              return {
                message: "数据修改成功."
              }
            })
        }
      }
    }
  })
})

export default schema