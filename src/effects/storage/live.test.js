import test from 'ava'
import sinon from 'sinon'

import storageEffectsFactory from './live'

let storage, store
let setStub, getStub
let storageEffects

test.beforeEach(t => {
  getStub = sinon.stub().returns(42)
  setStub = sinon.stub()

  storage = sinon.stub().returns({
    set: setStub,
    get: getStub
  })

  store = {
    dispatch: sinon.stub(),
    getState: sinon.stub().returns({
      volume: 0.8,
      rate: 0.8,
      playtime: 100,
      quantiles: [
        [0, 20]
      ],
      tabs: {
        chapters: false,
        settings: true
      }
    })
  }

  storageEffects = storageEffectsFactory(storage)
})

test(`storageEffects: it exports a effect factory`, t => {
  t.is(typeof storageEffects, 'function')
})

test(`storageEffects: it sets the tabs on INIT if stored`, t => {
  storageEffects(store, {
    type: 'INIT',
    payload: {
      foo: 'bar'
    }
  })

  t.truthy(storage.called)
  t.deepEqual(store.dispatch.getCall(0).args[0], {
    type: 'SET_TABS',
    payload: 42
  })
})

test(`storageEffects: it sets the volume on INIT if stored`, t => {
  storageEffects(store, {
    type: 'INIT',
    payload: {
      foo: 'bar'
    }
  })

  t.truthy(storage.called)
  t.deepEqual(store.dispatch.getCall(1).args[0], {
    type: 'SET_VOLUME',
    payload: 42
  })
})

test(`storageEffects: it persists the volumen on SET_VOLUME`, t => {
  storageEffects(store, {
    type: 'INIT',
    payload: {
      foo: 'bar'
    }
  })

  storageEffects(store, {
    type: 'SET_VOLUME',
    payload: 0.5
  })

  t.is(setStub.getCall(0).args[0], 'volume')
  t.is(setStub.getCall(0).args[1], 0.8)
})

test(`storageEffects: it persists the tabs on TOGGLE_TAB`, t => {
  storageEffects(store, {
    type: 'INIT',
    payload: {
      foo: 'bar'
    }
  })

  storageEffects(store, {
    type: 'TOGGLE_TAB'
  })

  t.is(setStub.getCall(0).args[0], 'tabs')

  t.deepEqual(setStub.getCall(0).args[1], {
    chapters: false,
    settings: true
  })
})

test(`storageEffects: it doesn't sets state on INIT if nothing is stored`, t => {
  storage = sinon.stub().returns({
    set: setStub,
    get: sinon.stub().returns(undefined)
  })

  storageEffectsFactory(storage)(store, {
    type: 'INIT',
    payload: {
      foo: 'bar'
    }
  })

  t.falsy(store.dispatch.called)
})
