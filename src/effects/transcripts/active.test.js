import test from 'ava'
import sinon from 'sinon'
import browserEnv from 'browser-env'

import activeEffect from './active'
import { timeline, state } from './fixtures'

browserEnv(['window'])

let store

test.beforeEach(t => {
  window.requestAnimationFrame = cb => cb()

  store = {
    dispatch: sinon.stub(),
    getState: () => state
  }
})

test(`transcripts - active: exports a function`, t => {
  t.is(typeof activeEffect, 'function')
})

test(`transcripts - active: creates an search index on SET_TRANSCRIPTS_TIMELINE`, t => {
  activeEffect(store, {
    type: 'SET_TRANSCRIPTS_TIMELINE',
    payload: timeline
  })

  t.deepEqual(store.dispatch.getCall(0).args[0], {
    type: 'UPDATE_TRANSCRIPTS',
    payload: 1
  })
})

const playtimeTypes = ['SET_PLAYTIME', 'UPDATE_PLAYTIME']

playtimeTypes.forEach(type => {
  test(`transcripts - active: triggers search on ${type}`, t => {
    activeEffect(store, {
      type: 'SET_TRANSCRIPTS_TIMELINE',
      payload: timeline
    })

    activeEffect(store, {
      type: 'SET_PLAYTIME',
      payload: 350000
    })

    t.deepEqual(store.dispatch.getCall(1).args[0], {
      type: 'UPDATE_TRANSCRIPTS',
      payload: 5
    })
  })
})

test.cb(`transcripts - active: calls interval search debounced with playtime on DISABLE_GHOST_MODE`, t => {
  let calls = 1

  t.plan(2)

  store.dispatch = ({ type, payload }) => {
    if (calls === 1) {
      t.deepEqual({ type, payload }, { type: 'UPDATE_TRANSCRIPTS', payload: 1 })
      calls = calls + 1
      return
    }

    if (calls === 2) {
      t.deepEqual({ type, payload }, { type: 'UPDATE_TRANSCRIPTS', payload: 1 })
      t.end()
    }
  }

  activeEffect(store, {
    type: 'SET_TRANSCRIPTS_TIMELINE',
    payload: timeline
  })

  activeEffect(store, {
    type: 'DISABLE_GHOST_MODE'
  })

  activeEffect(store, {
    type: 'DISABLE_GHOST_MODE'
  })
})

test.cb(`transcripts - active: calls interval search debounced with payload on SIMULATE_PLAYTIME`, t => {
  let calls = 1

  t.plan(2)

  store.dispatch = ({ type, payload }) => {
    if (calls === 1) {
      t.deepEqual({ type, payload }, { type: 'UPDATE_TRANSCRIPTS', payload: 1 })
      calls = calls + 1
      return
    }

    if (calls === 2) {
      t.deepEqual({ type, payload }, { type: 'UPDATE_TRANSCRIPTS', payload: 5 })
      t.end()
    }
  }

  activeEffect(store, {
    type: 'SET_TRANSCRIPTS_TIMELINE',
    payload: timeline
  })

  activeEffect(store, {
    type: 'SIMULATE_PLAYTIME',
    payload: 350000
  })

  activeEffect(store, {
    type: 'SIMULATE_PLAYTIME',
    payload: 350000
  })
})
