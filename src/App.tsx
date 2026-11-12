import { useEffect, useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, Menu, X } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  { name: 'The Silent Residence', category: 'Residential', location: 'Copenhagen, Denmark', year: '2025', image: 'residence', alt: 'Sculptural white residence surrounded by green trees', description: 'A quiet dialogue between private life and the landscape. Natural light gives every room its own rhythm.', material: 'White concrete · Oak · Glass', area: '320 m²', number: '01' },
  { name: 'Concrete House 01', category: 'Residential', location: 'Zurich, Switzerland', year: '2025', image: 'hero', alt: 'Angular exposed concrete architecture against an open sky', description: 'An exploration of weight and weightlessness. Raw concrete frames intimate spaces and unexpected views.', material: 'Exposed concrete · Stone · Steel', area: '280 m²', number: '02' },
  { name: 'Nordic Pavilion', category: 'Cultural', location: 'Oslo, Norway', year: '2024', image: 'pavilion', alt: 'Flowing architectural facade with sculptural geometric lines', description: 'A place to pause, gather and look again. A sculptural envelope opens a new conversation with the city.', material: 'Cast concrete · Glass', area: '640 m²', number: '03' },
  { name: 'Form & Void', category: 'Interior', location: 'Antwerp, Belgium', year: '2024', image: 'interior', alt: 'Quiet neutral interior with natural materials and soft daylight', description: 'Less as an intention. A study in tactile surfaces, considered proportions and the spaces we leave unfilled.', material: 'Limestone · Plaster · Timber', area: '190 m²', number: '04' },
]
type Project = typeof projects[number]
const philosophy = 'ARCHITECTURE IS NOT ONLY WHAT WE BUILD. IT IS WHAT WE MAKE PEOPLE FEEL.'

function Photo({ name, alt, className = '', priority = false }: { name: string; alt: string; className?: string; priority?: boolean }) {
  return <img className={className} src={`/images/${name}-${name === 'hero' ? '1920' : '1440'}.webp`} srcSet={`/images/${name}-768.webp 768w, /images/${name}-${name === 'hero' ? '1920' : '1440'}.webp ${name === 'hero' ? '1920' : '1440'}w`} sizes="(max-width: 700px) 100vw, 85vw" alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" width={name === 'hero' ? 1920 : 1440} height={1080} />
}

function App() {
  const root = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const projectOpener = useRef<HTMLElement | null>(null)
  const [selected, setSelected] = useState<Project | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [active, setActive] = useState(0)

  useEffect(() => {
    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('.brand, .desktop-nav, .header-contact', { y: -15, opacity: 0, duration: .8, stagger: .08 })
          .from('.hero-title .line-inner', { yPercent: 110, rotate: 2, duration: 1.25, stagger: .13 }, '-=.4')
          .from('.hero-visual', { clipPath: 'inset(16% 0 0 0)', opacity: 0, duration: 1.3 }, '-=1')
          .from('.hero-foot > *', { y: 16, opacity: 0, stagger: .1, duration: .7 }, '-=.8')
        gsap.to('.hero-image', { scale: 1.13, yPercent: 7, ease: 'none', scrollTrigger: { trigger: '.hero-visual', start: 'top 35%', end: 'bottom top', scrub: true } })
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => {
          gsap.from(el, { y: 45, opacity: 0, duration: .95, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
        })
        gsap.from('.philosophy-word', { opacity: .17, stagger: .15, ease: 'none', scrollTrigger: { trigger: '.philosophy-quote', start: 'top 80%', end: 'bottom 45%', scrub: .5 } })
        gsap.fromTo('.featured-photo', { clipPath: 'inset(12% 15% 12% 15%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: '.featured', start: 'top 85%', end: 'top 10%', scrub: .6 } })
        gsap.fromTo('.featured-photo img', { scale: 1.18, yPercent: -5 }, { scale: 1, yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.featured', start: 'top bottom', end: 'bottom top', scrub: .7 } })
        gsap.from('.featured-title', { y: 75, scrollTrigger: { trigger: '.featured', start: 'top bottom', end: 'bottom top', scrub: .6 } })
        gsap.from('.featured-caption', { opacity: 0, clipPath: 'inset(0 100% 0 0)', duration: 1, scrollTrigger: { trigger: '.featured-caption', start: 'top 93%' } })
        gsap.utils.toArray<HTMLElement>('.approach-item').forEach(el => {
          gsap.from(el.querySelector('.approach-line'), { scaleX: 0, transformOrigin: 'left', duration: 1.2, scrollTrigger: { trigger: el, start: 'top 88%' } })
          gsap.from(el.querySelectorAll('.approach-content > *'), { y: 24, opacity: 0, stagger: .12, duration: .8, scrollTrigger: { trigger: el, start: 'top 88%' } })
        })
      })
      mm.add('(min-width: 1000px) and (prefers-reduced-motion: no-preference)', () => {
        const track = root.current!.querySelector<HTMLElement>('.project-track')!
        const tween = gsap.to(track, { x: () => -(track.scrollWidth - track.parentElement!.clientWidth), ease: 'none', scrollTrigger: { trigger: '.projects', pin: true, start: 'top top', end: () => `+=${track.scrollWidth - track.parentElement!.clientWidth}`, scrub: .7, invalidateOnRefresh: true, onUpdate: self => setActive(Math.min(3, Math.round(self.progress * 3))) } })
        const followKeyboardFocus = (event: FocusEvent) => {
          if (!(event.target instanceof HTMLElement) || !event.target.matches(':focus-visible')) return
          const card = event.target.closest<HTMLElement>('.project-card')
          const trigger = tween.scrollTrigger
          if (card && trigger) {
            const offset = Math.min(card.offsetLeft - track.offsetLeft, track.scrollWidth - track.parentElement!.clientWidth)
            window.scrollTo({ top: trigger.start + offset, behavior: 'instant' })
          }
        }
        track.addEventListener('focusin', followKeyboardFocus)
        return () => track.removeEventListener('focusin', followKeyboardFocus)
      })
    }, root)
    let mounted = true
    const refresh = () => { if (mounted) ScrollTrigger.refresh() }
    document.fonts.ready.then(refresh)
    window.addEventListener('load', refresh)
    const magneticElement = root.current?.querySelector('.magnetic')
    return () => { mounted = false; window.removeEventListener('load', refresh); if (magneticElement) gsap.killTweensOf(magneticElement); mm.revert(); ctx.revert() }
  }, [])

  useEffect(() => {
    if (!selected) return
    dialog.current?.showModal()
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = old; projectOpener.current?.focus() }
  }, [selected])

  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  const openProject = (project: Project, element: HTMLElement) => { projectOpener.current = element; setSelected(project) }
  const closeProject = () => { dialog.current?.close(); setSelected(null) }
  const magnetic = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return
    const box = event.currentTarget.getBoundingClientRect()
    gsap.to(event.currentTarget, { x: (event.clientX - box.left - box.width / 2) * .18, y: (event.clientY - box.top - box.height / 2) * .18, duration: .4 })
  }
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const next: Record<string, string> = {}
    if (String(data.get('name')).trim().length < 2) next.name = 'Please enter at least 2 characters.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get('email')).trim())) next.email = 'Please enter a valid email address.'
    if (String(data.get('message')).trim().length < 20) next.message = 'Tell us a little more (at least 20 characters).'
    setErrors(next)
    setFormMessage(Object.keys(next).length ? '' : 'Your demo inquiry is ready. Nothing has been sent or stored — this is a portfolio concept.')
    if (Object.keys(next).length) form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus()
  }

  return <div ref={root}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <a className="brand" href="#" aria-label="Monolith home"><span className="brand-symbol" aria-hidden="true"><i /><i /><i /></span>MONOLITH<span className="brand-dot">®</span></a>
      <nav className="desktop-nav" aria-label="Main navigation"><a href="#projects">Selected work <span>04</span></a><a href="#studio">The studio</a><a href="#approach">Our approach</a></nav>
      <a className="header-contact" href="#contact">Let’s talk <ArrowUpRight size={16} /></a>
      <button className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      {menuOpen && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">{[['Selected work', 'projects'], ['The studio', 'studio'], ['Our approach', 'approach'], ['Let’s talk', 'contact']].map(([label, target]) => <a key={target} onClick={() => setMenuOpen(false)} href={`#${target}`}>{label}<ArrowUpRight /></a>)}</nav>}
    </header>

    <main id="main">
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-topline"><span>ARCHITECTURE & SPATIAL DESIGN</span><span>CONSIDERED SPACES. LASTING IMPACT.</span></div>
        <h1 id="hero-heading" className="hero-title" aria-label="Spaces that define experience."><span className="line" aria-hidden="true"><span className="line-inner">SPACES THAT</span></span><span className="line" aria-hidden="true"><span className="line-inner">DEFINE <span className="serif-word">experience.</span></span></span></h1>
        <div className="hero-visual"><Photo name="hero" alt="Monumental concrete forms and angular walls meeting a pale sky" className="hero-image" priority /><div className="image-shade" /><span className="image-coordinate">FORM / MATERIAL / FEELING</span><a className="hero-project" href="#featured"><span>IN FOCUS — 2025<br /><strong>Concrete House 01</strong></span><span className="round-arrow"><ArrowUpRight size={22} /></span></a><span className="hero-side-label">A STUDY IN QUIET EXPRESSION</span></div>
        <div className="hero-foot"><span>Independent thinking.<br />Intentional architecture.</span><a href="#projects">SCROLL TO EXPLORE <ArrowDown size={15} /></a><span>BASED IN EUROPE.<br />DESIGNED WITHOUT BORDERS.</span></div>
      </section>

      <section id="projects" className="projects" aria-labelledby="projects-heading">
        <div className="section-heading"><span className="eyebrow"><span className="small-square" />01 / SELECTED WORK</span><span className="section-note">A collection of imagined places.<br />An exploration of what could be.</span></div>
        <div className="projects-heading-row"><h2 id="projects-heading">Built on <em>intention.</em></h2><span className="gallery-count"><span>0{active + 1}</span> / 04 <ArrowRight size={19} /></span></div>
        <div className="gallery-window"><div className="project-track">{projects.map(project => <article className="project-card" key={project.name}><button className="project-image-button" onClick={event => openProject(project, event.currentTarget)} aria-label={`Explore ${project.name}`}><Photo name={project.image} alt={project.alt} /><span className="project-index">/{project.number}</span><span className="project-explore">EXPLORE PROJECT <ArrowUpRight size={20} /></span></button><div className="project-meta"><h3><button onClick={event => openProject(project, event.currentTarget)}>{project.name}</button></h3><span>{project.category} / {project.year}</span></div><p>{project.description}</p></article>)}</div></div>
        <div className="gallery-bottom"><span>RESIDENTIAL — CULTURAL — INTERIOR</span><span className="desktop-hint">SCROLL TO DISCOVER <ArrowRight size={15} /></span></div>
      </section>

      <section id="studio" className="philosophy" aria-labelledby="philosophy-heading"><div className="section-heading"><h2 id="philosophy-heading" className="eyebrow"><span className="small-square" />02 / OUR PHILOSOPHY</h2><span className="section-note">Beyond the built environment.</span></div><p className="philosophy-quote"><span className="sr-only">{philosophy}</span><span aria-hidden="true">{philosophy.split(' ').map((word, index) => <span key={index} className={`philosophy-word ${index > 10 ? 'feeling-word' : ''}`}>{word} </span>)}</span></p><div className="philosophy-bottom"><span className="asterisk" aria-hidden="true">✳</span><div data-reveal><p>We believe the most powerful spaces don’t demand attention. They hold it.</p><p>MONOLITH is a conceptual architecture studio exploring the relationship between people, materials and place. We find expression in restraint, beauty in honest materials, and possibility in the everyday.</p><a className="text-link" href="#approach">The thinking behind the spaces <ArrowUpRight size={18} /></a></div></div></section>

      <section id="featured" className="featured" aria-labelledby="featured-heading"><div className="featured-photo"><Photo name="hero" alt="Dramatic concrete angles and open sky, a study of light and mass" /><div className="image-shade" /></div><div className="featured-top"><span className="eyebrow">PROJECT IN FOCUS / 2025</span><span>02 — 04</span></div><div className="featured-title"><span>THE POETRY OF RESTRAINT.</span><h2 id="featured-heading">Concrete<br /><em>House 01.</em></h2></div><div className="featured-caption"><p>Raw material. Refined living.<br />A dialogue between light and mass.</p><button onClick={event => openProject(projects[1], event.currentTarget)} className="featured-button">Explore the concept <ArrowUpRight size={22} /></button></div></section>

      <section id="approach" className="approach" aria-labelledby="approach-heading"><div className="approach-intro" data-reveal><span className="eyebrow"><span className="small-square" />03 / THE PROCESS</span><h2 id="approach-heading">Good spaces.<br /><em>Clear thinking.</em></h2><p>From the first question to the final detail.<br />A considered process, every step of the way.</p></div><div className="approach-list">{[{title: 'Discover', subtitle: 'LISTEN. QUESTION. UNDERSTAND.', text: 'Every place has a story. We start by listening — to the site, the context, and the people who will call it theirs.'}, {title: 'Design', subtitle: 'EXPLORE. REFINE. RESOLVE.', text: 'Ideas become form. Through sketches, material studies and thoughtful iteration, we find clarity in the complex.'}, {title: 'Deliver', subtitle: 'DETAIL. COLLABORATE. REALISE.', text: 'The intention lives in the details. A collaborative approach carries the original vision into every material and junction.'}].map((item, i) => <article className="approach-item" key={item.title}><div className="approach-line" /><div className="approach-content"><span className="step-number">0{i + 1}</span><h3>{item.title}</h3><ArrowUpRight size={24} /><span className="step-subtitle">{item.subtitle}</span><p>{item.text}</p></div></article>)}</div></section>

      <section id="contact" className="contact" aria-labelledby="contact-heading"><div className="section-heading"><span className="eyebrow"><span className="small-square" />04 / START A CONVERSATION</span><span className="section-note">Every great space begins with a question.</span></div><div className="contact-head"><h2 id="contact-heading">LET’S SHAPE<br />SOMETHING<br /><em>meaningful.</em></h2><a className="magnetic" href="#inquiry" aria-label="Start a project inquiry" onPointerMove={magnetic} onPointerLeave={event => gsap.to(event.currentTarget, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1, .5)' })}><ArrowUpRight strokeWidth={1} /></a></div><div className="contact-lower"><div className="contact-note"><span className="eyebrow">A LITTLE ABOUT YOUR VISION</span><p>A place to live. A place to gather.<br />A different way to see what’s possible.</p><span className="demo-label"><span />PORTFOLIO CONCEPT / DEMO FORM</span><p className="demo-explanation">This is an interactive demonstration. Your information is validated in your browser and is never sent or stored.</p></div><form id="inquiry" noValidate onSubmit={submit}><div className="form-grid"><div className="field"><label htmlFor="name">Your name <span>*</span></label><input id="name" name="name" placeholder="Alex Morgan" autoComplete="name" required minLength={2} maxLength={100} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} />{errors.name && <span id="name-error" className="error">{errors.name}</span>}</div><div className="field"><label htmlFor="email">Email address <span>*</span></label><input id="email" name="email" type="email" placeholder="alex@studio.com" autoComplete="email" required maxLength={200} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />{errors.email && <span id="email-error" className="error">{errors.email}</span>}</div></div><div className="field"><label htmlFor="message">What do you have in mind? <span>*</span></label><textarea id="message" name="message" placeholder="Tell us about your space, your ideas, your ambitions…" rows={2} required minLength={20} maxLength={4000} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} />{errors.message && <span id="message-error" className="error">{errors.message}</span>}</div><button type="submit" className="submit-button">Preview inquiry <ArrowUpRight size={20} /></button><p className="form-status" role="status">{formMessage && <><Check size={18} />{formMessage}</>}</p></form></div></section>
    </main>

    <footer><div className="footer-top"><a href="#" className="brand">MONOLITH<span className="brand-dot">®</span></a><span>ARCHITECTURE & SPATIAL DESIGN</span><a href="#main" className="text-link">Back to top <ArrowUpRight size={17} /></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} MONOLITH — A CONCEPT PROJECT.</span><span>DESIGN & DEVELOPMENT BY <strong>NULLEXWEB</strong></span><a href="/IMAGE_CREDITS.md" target="_blank" rel="noreferrer">Photography credits <ArrowUpRight size={12} /></a></div><p className="concept-disclosure">Fictional studio and projects. An independent portfolio exploration by NULLEXWEB, not a commission for a real architecture practice. Photography illustrates the concepts.</p></footer>

    <dialog ref={dialog} className="project-dialog" onCancel={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) closeProject() }} aria-labelledby="dialog-title">{selected && <div className="dialog-content"><div className="dialog-bar"><span className="eyebrow">PROJECT STUDY / {selected.number}</span><button onClick={closeProject} aria-label="Close project"><X /></button></div><Photo name={selected.image} alt={selected.alt} /><div className="dialog-copy"><span className="eyebrow">{selected.category} / CONCEPT {selected.year}</span><h2 id="dialog-title">{selected.name}</h2><p>{selected.description}</p><dl><div><dt>Imagined location</dt><dd>{selected.location}</dd></div><div><dt>Concept area</dt><dd>{selected.area}</dd></div><div><dt>Material palette</dt><dd>{selected.material}</dd></div></dl><p className="dialog-disclosure">An unbuilt, fictional design study by NULLEXWEB. The photograph is an illustrative reference, not a depiction of a MONOLITH commission.</p><button className="text-link" onClick={closeProject}><ArrowLeft size={17} /> Back to selected work</button></div></div>}</dialog>
  </div>
}
export default App
