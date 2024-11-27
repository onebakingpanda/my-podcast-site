import test from 'ava'
import { reducer as share } from './reducer'

let expected

test.beforeEach(t => {
  expected = {
    content: 'episode',
    embed: {
      available: ['250x400', '320x400', '375x400', '600x290', '768x290'],
      size: '320x400'
    }
  }
})

test(`share: is a reducer function`, t => {
  t.is(typeof share, 'function')
})

test(`share: it returns the state on default`, t => {
  let result = share(undefined, {
    type: 'FOO_BAR'
  })

  t.deepEqual(result, expected)
})

test(`share: it sets the share content on SET_SHARE_CONTENT`, t => {
  let result = share(undefined, {
    type: 'SET_SHARE_CONTENT',
    payload: 'episode'
  })

  expected.content = 'episode'
  t.deepEqual(result, expected)
})

test(`share: it sets the embed size on SET_SHARE_EMBED_SIZE`, t => {
  let result = share(undefined, {
    type: 'SET_SHARE_EMBED_SIZE',
    payload: '250x400'
  })

  expected.embed.size = '250x400'
  t.deepEqual(result, expected)
})
