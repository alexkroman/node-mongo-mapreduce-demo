module.exports = {
    development: {
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'Node timer'
      },
      db: 'mongodb://localhost/noobjs_dev',
    }
}
