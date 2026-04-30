export const removeUndefinedDeep = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedDeep);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, removeUndefinedDeep(v)])
    );
  }
  return obj;
};
