import { useEffect, useState } from 'react'
import { ArrowDownRight, ArrowRight, Bookmark, Check, Clock3, Code2, Compass, Cpu, GraduationCap, Layers3, Lightbulb, Search, Shuffle, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { projects as starterProjects } from '@/data/projects'

const categories = [
  { name: 'All projects', icon: Layers3 },
  { name: 'Web development', icon: Code2 },
  { name: 'AI & machine learning', icon: Sparkles },
  { name: 'Mobile apps', icon: Compass },
  { name: 'IoT & hardware', icon: Cpu },
]
const categoryStyles = {
  'Web development': 'category-web',
  'AI & machine learning': 'category-ai',
  'Mobile apps': 'category-mobile',
  'IoT & hardware': 'category-iot',
}

function readSavedProjects() {
  try { return JSON.parse(localStorage.getItem('projectpool-saved') || '[]') }
  catch { return [] }
}

function ProjectCard({ project, saved, onSave, onOpen }) {
  return (
    <article className="project-card">
      <button className="project-image-button" onClick={onOpen} aria-label={`View ${project.title}`}>
        <img className="project-image" src={project.image} alt={project.imageAlt} />
        <span className={`image-category ${categoryStyles[project.category] || ''}`}>{project.category}</span>
        <span className="image-open"><ArrowDownRight size={17} /></span>
      </button>
      <div className="project-card-body">
        <div className="project-meta"><span className={`difficulty difficulty-${project.difficulty.toLowerCase()}`}>{project.difficulty}</span><span className="duration"><Clock3 size={13} /> {project.duration}</span></div>
        <button className="project-title-button" onClick={onOpen}><h3>{project.title}</h3><ArrowRight size={17} /></button>
        <p className="project-description">{project.description}</p>
        <div className="project-card-footer">
          <div className="tech-list">{project.technology.slice(0, 3).map((tech) => <span key={tech}>{tech}</span>)}</div>
          <Button variant="ghost" size="icon" className={`save-button ${saved ? 'is-saved' : ''}`} onClick={onSave} aria-label={saved ? `Remove ${project.title} from saved projects` : `Save ${project.title}`} title={saved ? 'Remove saved project' : 'Save project'}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} /></Button>
        </div>
      </div>
    </article>
  )
}

function ProjectDialog({ project, saved, onSave, onClose }) {
  useEffect(() => {
    function closeOnEscape(event) { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <div className="dialog-image-wrap"><img src={project.image} alt={project.imageAlt} /><Button variant="ghost" size="icon" className="dialog-close" onClick={onClose} aria-label="Close project details"><X size={19} /></Button><span className={`image-category ${categoryStyles[project.category] || ''}`}>{project.category}</span></div>
        <div className="dialog-content">
          <div className="project-meta"><span className={`difficulty difficulty-${project.difficulty.toLowerCase()}`}>{project.difficulty}</span><span className="duration"><Clock3 size={13} /> {project.duration}</span></div>
          <h2 id="dialog-title">{project.title}</h2>
          <p className="dialog-overview">{project.overview}</p>
          <div className="detail-section"><h3>What you’ll build</h3><ul className="feature-list">{project.features.map((feature) => <li key={feature}><Check size={15} /> {feature}</li>)}</ul></div>
          <div className="detail-section"><h3>Suggested toolkit</h3><div className="detail-tech-list">{project.technology.map((tech) => <span key={tech}>{tech}</span>)}</div></div>
          <div className="detail-section"><h3>Final deliverables</h3><ul className="deliverable-list">{project.deliverables.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <Button className="dialog-save" variant={saved ? 'outline' : 'default'} onClick={onSave}><Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />{saved ? 'Saved to your ideas' : 'Save this idea'}</Button>
        </div>
      </section>
    </div>
  )
}

function App() {
  const [projects, setProjects] = useState(starterProjects)
  const [savedProjects, setSavedProjects] = useState(readSavedProjects)
  const [category, setCategory] = useState('All projects')
  const [difficulty, setDifficulty] = useState('all')
  const [sortBy, setSortBy] = useState('recommended')
  const [activeView, setActiveView] = useState('discover')
  const [query, setQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)
  const beginnerProjectCount = projects.filter((project) => project.difficulty === 'Beginner').length

  useEffect(() => {
    fetch('/api/projects')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Project API unavailable')))
      .then((data) => Array.isArray(data) && data.length && setProjects(data))
      .catch(() => {})
  }, [])

  useEffect(() => { localStorage.setItem('projectpool-saved', JSON.stringify(savedProjects)) }, [savedProjects])

  const visibleProjects = projects.filter((project) => {
    const matchesCategory = category === 'All projects' || project.category === category
    const matchesDifficulty = difficulty === 'all' || project.difficulty === difficulty
    const matchesView = activeView !== 'saved' || savedProjects.includes(project._id || project.id)
    const searchText = `${project.title} ${project.description} ${project.category} ${project.technology.join(' ')}`.toLowerCase()
    return matchesCategory && matchesDifficulty && matchesView && searchText.includes(query.trim().toLowerCase())
  })
  if (sortBy === 'shortest') visibleProjects.sort((first, second) => Number.parseInt(first.duration, 10) - Number.parseInt(second.duration, 10))
  if (sortBy === 'beginner') {
    const difficultyOrder = { Beginner: 0, Intermediate: 1, Advanced: 2 }
    visibleProjects.sort((first, second) => difficultyOrder[first.difficulty] - difficultyOrder[second.difficulty])
  }

  function toggleSaved(project) {
    const projectId = project._id || project.id
    setSavedProjects((current) => current.includes(projectId) ? current.filter((id) => id !== projectId) : [...current, projectId])
  }

  function selectView(view) { setActiveView(view); setCategory('All projects'); setDifficulty('all') }
  function openRandomProject() {
    if (visibleProjects.length) setSelectedProject(visibleProjects[Math.floor(Math.random() * visibleProjects.length)])
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#top" aria-label="ProjectPool home"><span className="brand-mark"><Lightbulb size={20} /></span><span>project<span>pool</span></span></a>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="primary-nav" aria-label="Main navigation">
          <button className={`nav-item ${activeView === 'discover' ? 'active' : ''}`} onClick={() => selectView('discover')}><Compass size={17} /><span>Discover ideas</span></button>
          <button className={`nav-item ${activeView === 'saved' ? 'active' : ''}`} onClick={() => selectView('saved')}><Bookmark size={17} /><span>Saved ideas</span><span className="nav-count">{savedProjects.length}</span></button>
        </nav>
        <div className="sidebar-label category-label">BROWSE BY FIELD</div>
        <nav className="category-nav" aria-label="Filter by project field">
          {categories.map(({ name, icon: Icon }) => <button key={name} className={`nav-item ${category === name ? 'active' : ''}`} onClick={() => { setCategory(name); setActiveView('discover') }}><Icon size={16} /><span>{name}</span></button>)}
        </nav>
        <div className="sidebar-bottom"><div className="sidebar-note-icon"><GraduationCap size={19} /></div><p>Made for curious minds.</p><span>Good luck with your next build.</span></div>
      </aside>

      <main id="top" className="main-content">
        <header className="topbar"><div className="breadcrumb"><span>Library</span><span className="breadcrumb-slash">/</span><strong>{activeView === 'saved' ? 'Saved ideas' : 'Explore'}</strong></div><div className="topbar-right"><span className="student-label"><span className="online-dot" /> STUDENT EDITION</span><div className="avatar">S</div></div></header>
        <section className="hero-band">
          <div className="hero-copy"><div className="eyebrow"><span /> THE COLLEGE PROJECT LIBRARY</div><h1>Find your next<br />big idea.</h1><p>Thoughtful project concepts, with a clear path from first sketch to final demo.</p><a className="hero-link" href="#project-list">Explore the collection <ArrowRight size={15} /></a></div>
          <div className="hero-photo" role="img" aria-label="A student workspace with a laptop and notebook" />
          <div className="hero-index"><span>CURATED FOR</span><strong>the curious</strong><ArrowDownRight size={18} /></div>
        </section>

        <section className="library-stats" aria-label="Project library overview">
          <div className="library-stat"><span className="stat-icon stat-icon-green"><Layers3 size={17} /></span><div><strong>{projects.length}</strong><span>project ideas</span></div></div>
          <div className="library-stat"><span className="stat-icon stat-icon-gold"><GraduationCap size={18} /></span><div><strong>{beginnerProjectCount}</strong><span>beginner friendly</span></div></div>
          <div className="library-stat"><span className="stat-icon stat-icon-coral"><Bookmark size={16} /></span><div><strong>{savedProjects.length}</strong><span>saved for later</span></div></div>
          <span className="stats-note"><Sparkles size={14} /> Your next idea is in here</span>
        </section>

        <section className="collection-section" id="project-list">
          <div className="section-heading"><div><span className="section-kicker">START WITH A SPARK</span><h2>{activeView === 'saved' ? 'Your saved ideas' : 'Ideas worth building'}</h2><p className="section-subtitle">Explore practical concepts made for your next semester project.</p></div><span className="result-count">{visibleProjects.length.toString().padStart(2, '0')} PROJECTS</span></div>
          <div className="collection-toolbar">
            <div className="filter-pills" role="group" aria-label="Filter project categories">
              {categories.slice(0, 3).map(({ name }) => <button key={name} className={`filter-pill ${category === name ? 'selected' : ''}`} onClick={() => { setCategory(name); setActiveView('discover') }}>{name === 'All projects' ? 'All ideas' : name}</button>)}
              {categories.slice(3).map(({ name }) => <button key={name} className={`filter-pill filter-pill-extra ${category === name ? 'selected' : ''}`} onClick={() => { setCategory(name); setActiveView('discover') }}>{name}</button>)}
            </div>
            <div className="discovery-controls">
              <label className="select-field"><span className="sr-only">Filter by difficulty</span><select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} aria-label="Filter by difficulty"><option value="all">Any level</option><option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option></select></label>
              <label className="select-field sort-field"><span className="sr-only">Sort projects</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort projects"><option value="recommended">Recommended</option><option value="shortest">Shortest timeline</option><option value="beginner">Beginner first</option></select></label>
              <label className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ideas or tools" aria-label="Search project ideas" /></label>
              <Button className="surprise-button" variant="outline" onClick={openRandomProject} disabled={!visibleProjects.length}><Shuffle size={15} /> Surprise me</Button>
            </div>
          </div>
          {visibleProjects.length ? <div className="project-grid">{visibleProjects.map((project) => { const projectId = project._id || project.id; return <ProjectCard key={projectId} project={project} saved={savedProjects.includes(projectId)} onSave={() => toggleSaved(project)} onOpen={() => setSelectedProject(project)} /> })}</div> : <div className="empty-state"><div className="empty-icon"><Search size={21} /></div><h3>No ideas found</h3><p>Try another search or choose a different field.</p><Button variant="outline" onClick={() => { setQuery(''); setCategory('All projects'); setDifficulty('all'); setActiveView('discover') }}>Clear filters</Button></div>}
          <div className="collection-end"><span>YOU’RE ALL CAUGHT UP</span><span className="end-line" /><Sparkles size={15} /></div>
        </section>
        <footer className="page-footer"><span>PROJECTPOOL · BUILT FOR WHAT’S NEXT</span><a href="mailto:hello@projectpool.dev">Share an idea <ArrowRight size={13} /></a></footer>
      </main>
      {selectedProject && <ProjectDialog project={selectedProject} saved={savedProjects.includes(selectedProject._id || selectedProject.id)} onSave={() => toggleSaved(selectedProject)} onClose={() => setSelectedProject(null)} />}
    </div>
  )
}

export default App