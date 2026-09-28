import { useRef, useState } from 'react';

function MarqueeRow({ quotes, index, paused }) {
  const rail = useRef(null);
  const drag = useRef(null);
  const [interacting, setInteracting] = useState(false);
  return <div className={`testimonial-rail marquee-row marquee-row-${index} ${interacting ? 'is-interacting' : ''}`} ref={rail} tabIndex="0" role="region" aria-label={`Testimonials row ${index + 1}. Use arrow keys or swipe to browse.`}
    onKeyDown={event => {
      if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
        rail.current.scrollBy({ left: event.key === 'ArrowRight' ? 316 : -316, behavior: 'smooth' });
      }
    }}
    onPointerDown={event => {
      setInteracting(true);
      if (event.pointerType === 'mouse') {
        drag.current = { x: event.clientX, scroll: rail.current.scrollLeft };
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    }}
    onPointerMove={event => { if (drag.current) rail.current.scrollLeft = drag.current.scroll + drag.current.x - event.clientX; }}
    onPointerUp={() => { drag.current = null; setInteracting(false); }}
    onPointerCancel={() => { drag.current = null; setInteracting(false); }}>
    <div className="marquee-track" style={{ animationPlayState: paused ? 'paused' : undefined }}>
      {[0, 1].map(copy => <div className="marquee-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
        {quotes.map(([name, quote, color]) => <figure className="quote" key={name} style={{ backgroundColor: color }}><blockquote>“{quote}”</blockquote><figcaption>{name}</figcaption></figure>)}
      </div>)}
    </div>
  </div>;
}

export default function Testimonials({ quotes }) {
  const [paused, setPaused] = useState(false);
  return <section className="testimonials" id="testimonials" aria-labelledby="testimonials-title">
    <div className="testimonial-heading"><h2 id="testimonials-title">Stories from the circle.</h2><p>Saving together, in their own words.</p>
      <button className="marquee-toggle" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? 'Play stories' : 'Pause stories'}<span aria-hidden="true">{paused ? ' ▷' : ' Ⅱ'}</span></button>
    </div>
    <div className="marquee-rows">{[quotes.slice(0, 3), quotes.slice(3)].map((row, index) => <MarqueeRow quotes={row} index={index} paused={paused} key={index} />)}</div>
  </section>;
}
