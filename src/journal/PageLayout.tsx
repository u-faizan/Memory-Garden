import { flowerArt, flowerInfo } from '../garden/flowers'
import type { Entry } from '../lib/db'
import { formatDate, photoUrl } from './format'
import { Butterfly, Sprig } from '../components/book/BookArt'

// One adaptive page, shared by preview and reading. With a photo: title, date
// and the taped photograph on the left; the words, feeling note and pressed
// flower tag on the right. Without one: words on the left, flower on the right.
function Heading({ entry }: { entry: Entry }) {
  return <header className="page-heading">
    <h2 className="page-title">{entry.title || 'Untitled memory'}</h2>
    <p className="page-date">{formatDate(entry.memoryDate)}</p>
  </header>
}

function PressedFlower({ entry, large }: { entry: Entry; large?: boolean }) {
  const flower = flowerInfo(entry.flowerType)
  return <figure className={`pressed ${large ? 'pressed--large' : ''}`}>
    <span className="pressed-tape" aria-hidden="true" />
    <img src={flowerArt(entry.flowerType, 'bloom')} alt="" />
    <figcaption className="plant-tag"><strong>{flower.name}</strong><span>{flower.meaning}</span></figcaption>
  </figure>
}

export function PageLayout({ entry }: { entry: Entry }) {
  const url = photoUrl(entry.photo)
  const handwritten = [...entry.story].length <= 420
  const note = entry.feeling && <p className="sticky-note">{entry.feeling}</p>
  return <div className={`page-spread ${url ? 'page-spread--photo' : 'page-spread--words'}`}>
    <Sprig className="page-sprig page-sprig--a" gold={false} />
    <Butterfly className="page-butterfly" fill="#c7a55b" />
    <section className="page page--left">
      <Heading entry={entry} />
      {url
        ? <figure className="page-photo"><img src={url} alt={`Photograph for “${entry.title || 'this memory'}”`} /></figure>
        : <div className={`page-story ${handwritten ? 'page-story--hand' : ''}`}>{entry.story}</div>}
    </section>
    <section className="page page--right">
      {url && <div className={`page-story ${handwritten ? 'page-story--hand' : ''}`}>{entry.story}</div>}
      <div className="page-keepsakes">{note}<PressedFlower entry={entry} large={!url} /></div>
    </section>
    <Sprig className="page-sprig page-sprig--b" gold={false} />
  </div>
}
