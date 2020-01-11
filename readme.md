## nodejs中端

两种方法：

①使用axios.all方法获取数据进行处理。

```js
exports.get = ({url, params={}}) => {
  return axios({
    url,
    params
  })
  .then((result) => {
    return result.data
  })
}

exports.all = (promiseArr) => {
  return axios.all(promiseArr)
    .then(axios.spread((...resultList) => {
      return resultList
    }))
}
```

```js
router.get('/all', async (req, res, next) => {
  let java = await get({
    url: 'http://localhost:9000/api/list'
  })

  let node = get({
    url: 'http://localhost:4040/users'
  })

  let php = get({
    url: 'https://ik9hkddr.qcloud.la/index.php/trade/get_list'
  })

  let nodeAndphp = await all([node, php])
  
  res.json({
    java,
    nodeAndphp
  })
})
```

此方法会返回一个新的数据类型格式，但只是对数据进行简单的拼接，笼统的返回，并不能进行太多的处理，所以引出第二种方法。

②graphql

安装环境，

```
yarn add express @babel/cli @babel/core @babel/node @babel/preset-env
```

在package.json添加配置

```
scripts: {
"dev": "nodemon index.js --exec @babel/node --presets @babel/preset-env",
}
```

添加操作

```
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
```

修改①

```
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
            type: GraphQLString  //
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
      },//put/delete/patch/需要在后面确定修改第几个

```

修改②

```
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

```

删除

```js
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
```

查询

```
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
```



> query 查询信息