import { get } from 'lodash'
import { handleActions } from 'redux-actions'

import { INIT } from '../types'

export const INITIAL_STATE = [
  'tabInfo',
  'tabChapters',
  'tabFiles',
  'tabAudio',
  'tabShare',
  'tabTranscripts',
  'poster',
  'showTitle',
  'episodeTitle',
  'subtitle',
  'progressbar',
  'controlSteppers',
  'controlChapters'
]

const toVisibleComponentState = (components = []) =>
  components.reduce((result, component) => ({
    ...result,
    [component]: true
  }), {})

export const reducer = handleActions({
  [INIT]: (_, { payload }) => toVisibleComponentState(get(payload, 'visibleComponents', INITIAL_STATE))
}, toVisibleComponentState(INITIAL_STATE))
