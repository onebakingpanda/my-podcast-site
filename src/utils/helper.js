import { isUndefinedOrNull } from './predicates'

/**
 * Collection of functional helpers
 */

export const inAnimationFrame = func => (...args) => window.requestAnimationFrame(() => func.apply(null, args))
export const asyncAnimation = func => (...args) => new Promise(resolve => {
  window.requestAnimationFrame(resolve(func.apply(null, args)))
})

export const callWith = (...args) => func => func.apply(null, args)

// Math helpers
export const toInt = (input = 0) => isNaN(parseInt(input, 10)) ? 0 : parseInt(input, 10)
export const toFloat = (input = 0) => isNaN(parseFloat(input)) ? 0 : parseFloat(input)

// Functional Helper

export const fallbackTo = fallback => value => isUndefinedOrNull(value) ? fallback : value
