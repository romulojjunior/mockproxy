const isDebug = process.env.MOCK_DEBUG

const log = (...args) => {
  console.log(...args)
}

const logd = (...args) => {
  if (isDebug) console.log(...args)
}

module.exports = {
  log,
  logd
};