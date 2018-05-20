module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'react-mic-record',
      externals: {
        react: 'React'
      }
    }
  }
}
