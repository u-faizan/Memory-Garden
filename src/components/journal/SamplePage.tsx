import { useEffect, useRef } from 'react'
import { FlowerArt } from '../../art/flowers/FlowerArt'
import { Butterfly, Sprig } from '../book/BookArt'

interface Props { open: boolean; onClose: () => void; onReplay: () => void }

// A fictional page previewing the botanical journal's direction. Real writing,
// saving and reading arrive in slice 2; this page says so plainly.
export function SamplePage({ open, onClose, onReplay }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])
  return <dialog ref={dialogRef} className="journal" aria-labelledby="sample-title"
    onCancel={event => { event.preventDefault(); onClose() }}
    onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    {open && <article className="journal-book">
      <button className="journal-close" onClick={onClose} aria-label="Back to garden">×</button>
      <section className="journal-page journal-page--left">
        <p className="journal-eyebrow">A page from your garden · sample</p>
        <h2 id="sample-title">A Small Victory</h2>
        <p className="journal-date">14 May 2024</p>
        <div className="journal-story">
          <p>The studio review ran long, and my hands shook the whole way through. When it ended, my tutor simply nodded and said, “Keep going.”</p>
          <p>I walked out into the late sun and bought the brightest flowers on the corner. It felt like the first day of something.</p>
        </div>
        <p className="journal-disclosure">A fictional sample page. Writing and keeping your own memories arrives in the next step.</p>
        <div className="journal-actions">
          <button className="journal-primary" onClick={onClose}>Back to garden</button>
          <button className="journal-secondary" onClick={onReplay}>Replay the bloom</button>
        </div>
      </section>
      <section className="journal-page journal-page--right" aria-label="Botanical plate">
        <Sprig className="journal-sprig journal-sprig--top" gold={false} />
        <Sprig className="journal-sprig journal-sprig--bottom" gold={false} />
        <Butterfly className="journal-butterfly" fill="#c7a55b" />
        <div className="journal-plate"><FlowerArt type="sunflower" stage="bloom" animate={false} /></div>
        <div className="journal-label">
          <strong>Sunflower</strong>
          <em>Helianthus annuus</em>
          <span>Joy · Achievement</span>
        </div>
        <p className="journal-note">“Keep going.”</p>
      </section>
    </article>}
  </dialog>
}
