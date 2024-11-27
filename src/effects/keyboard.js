import { get } from 'lodash'
import actions from 'store/actions'

let modifier = 0

const calcModifier = () => {
  modifier = modifier < 7 ? modifier + 0.25 : 7
  return modifier
}

const resetModifier = () => {
  modifier = 0
}

const scrubForward = store => () => {
  const state = store.getState()
  const playtime = get(state, 'playtime')
  const duration = get(state, 'duration')
  let time = playtime + Math.pow(2, calcModifier())

  time = time > duration ? duration : time

  store.dispatch(actions.updatePlaytime(time))
}

const scrubBackward = store => () => {
  const state = store.getState()
  const playtime = get(state, 'playtime')
  let time = playtime - Math.pow(2, calcModifier())

  time = time > 0 ? time : 0

  store.dispatch(actions.updatePlaytime(time))
}

const playPause = store => () => {
  const playstate = get(store.getState(), 'playstate')

  if (playstate === 'playing') {
    store.dispatch(actions.pause())
  } else {
    store.dispatch(actions.play())
  }
}

const nextChapter = ({ dispatch }) => () => dispatch(actions.nextChapter())
const previousChapter = ({ dispatch }) => () => dispatch(actions.previousChapter())

const changeVolume = (store, modifier) => () => {
  const state = store.getState()
  const volume = get(state, 'volume', 0)

  store.dispatch(actions.setVolume(parseFloat(volume) + modifier))
}

const changeRate = (store, modifier) => () => {
  const state = store.getState()
  const rate = get(state, 'rate', 0)

  store.dispatch(actions.setRate(parseFloat(rate) + modifier))
}

const mute = (store) => () => {
  const state = store.getState()
  const muted = get(state, 'muted', false)

  if (muted) {
    store.dispatch(actions.unmute())
  } else {
    store.dispatch(actions.mute())
  }
}

export default keyhandler => store => {
  keyhandler('right', scrubForward(store), resetModifier)
  keyhandler('left', scrubBackward(store), resetModifier)
  keyhandler('space', playPause(store))
  keyhandler('alt+right', nextChapter(store))
  keyhandler('alt+left', previousChapter(store))
  keyhandler('shift+up', changeVolume(store, 0.05))
  keyhandler('shift+down', changeVolume(store, -0.05))
  keyhandler('alt+up', changeRate(store, 0.05))
  keyhandler('alt+down', changeRate(store, -0.05))
  keyhandler('m', mute(store))
}
