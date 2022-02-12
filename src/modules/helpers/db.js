const db = {
  camelCaseToSnakeCase: object => {
    let r = {};
    if(typeof object !== 'object') return r;

    Object.keys(object).forEach(key => {
      r[
        key.replace( /([A-Z])/g, '_$1').toLowerCase()
      ] = object[key];
    });

    return r;
  }
};

export default db;