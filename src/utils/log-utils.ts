const isDebug = JSON.parse(process.env.MOCK_DEBUG || 'false');

export const log = (...args: any) => {
  console.log(args);
};

export const logd = (...args: any) => {
  if (isDebug) console.log(...args);
};

export default {
  log,
  logd
};