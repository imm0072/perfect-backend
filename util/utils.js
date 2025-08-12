module.exports = {
  getProperty: (req, key, defValue=undefined) => { 
 return req?.body?.[key] ?? req?.params?.[key] ?? req?.query?.[key] ??defValue;
  }
};
