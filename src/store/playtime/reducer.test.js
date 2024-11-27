import test from 'ava'
import { reducer as playtime } from './reducer'

// PLAYTIME TESTS
test(`playtime: is a reducer function`, t => {
  t.is(typeof playtime, 'function')
})

test(`playtime: parses the playtime on INIT`, t => {
  let result = playtime(undefined, {
    type: 'INIT',
    payload: {
      playtime: '01:00'
    }
  })

  t.is(result, 60000)
})

test(`playtime: parses playtime on UPDATE_PLAYTIME`, t => {
  let result = playtime(undefined, {
    type: 'UPDATE_PLAYTIME',
    payload: '60'
  })

  t.is(result, 60)
})

test(`playtime: parses playtime on SET_PLAYTIME`, t => {
  let result = playtime(undefined, {
    type: 'SET_PLAYTIME',
    payload: 60
  })

  t.is(result, 60)
})

test(`playtime: it does nothing if a unknown action is dispatched`, t => {
  const result = playtime(10, {
    type: 'NOT_A_REAL_TYPE'
  })
  t.is(result, 10)
})
