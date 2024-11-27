import { compose } from 'lodash/fp'

import { INIT } from 'store/types'

import storage from 'utils/storage'
import keyhandler from 'utils/keyboard'
import { hasProperty, conditionalEffect } from 'utils/effects'
import { callWith } from 'utils/helper'

import playerEffectsFactory from './player'
import storageEffectsFactory from './storage'
import keyboardEffectsFactory from './keyboard'
import componentsEffects from './components'
import quantileEffects from './quantiles'
import chapterEffects from './chapters'
import volumeEffects from './volume'
import playbackEffects from './playback'
import transcriptEffects from './transcripts'
import runtimeEffects from './runtime'

import mediaPlayer from '../media'

const storageEffects = storageEffectsFactory(storage)
const keyboardEffects = keyboardEffectsFactory(keyhandler)
const playerEffects = playerEffectsFactory(mediaPlayer)

const dispatcherEffects = [keyboardEffects]

const condEffects = [
  conditionalEffect(playbackEffects),
  conditionalEffect(playerEffects),
  conditionalEffect(storageEffects),
  conditionalEffect(quantileEffects),
  conditionalEffect(volumeEffects),
  conditionalEffect(runtimeEffects),
  conditionalEffect(componentsEffects),
  compose(conditionalEffect(chapterEffects)),
  compose(conditionalEffect(transcriptEffects), hasProperty('transcripts'))
]

let actionEffects = []

export default store => {
  dispatcherEffects.map(callWith(store))

  return next => action => {
    next(action)

    // Conditional effects need the initial payload to create
    if (action.type === INIT) {
      actionEffects = condEffects.map(callWith(action.payload))
    }

    actionEffects.map(callWith(store, action))
  }
}
