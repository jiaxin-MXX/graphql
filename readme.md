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