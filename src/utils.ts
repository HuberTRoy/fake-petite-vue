export const isArray = Array.isArray
export const isString = (val:any):val is string => typeof val === 'string'
export const isObject = (val:unknown): val is Record<any, any> => val !== null && typeof val === 'object'