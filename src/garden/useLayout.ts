import { useSyncExternalStore } from 'react'
import { layouts, type WorldLayout } from './layouts'

// Portrait screens get the separately composed tall garden.
const query = '(max-aspect-ratio: 1/1)'
function subscribe(onChange: () => void) {
  const media = window.matchMedia(query)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}
export function useLayout(): WorldLayout {
  const tall = useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false)
  return tall ? layouts.tall : layouts.wide
}
