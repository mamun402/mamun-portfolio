import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Download,
  ExternalLink,
  Github,
  GraduationCap,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  Send,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import {
  initialDesigns,
  initialCv,
  initialProfile,
  initialProjects,
  initialContent,
  readSections,
  readStored,
} from "./content.js";
import { emptyPortfolio, loadPortfolio } from "./portfolioStore.js";

const nav = [
  "About",
  "Experience",
  "Skills",
  "Projects",
  "Designs",
  "Leadership",
  "Contact",
];
const experiences = [
  {
    role: "IT Manager",
    company: "Hotel Valley Garden",
    place: "Sylhet, Bangladesh",
    date: "Editable dates",
    text: [
      "Manage the hotel website and digital platforms, ensuring accurate information, regular updates, and smooth operation.",
      "Provide IT support across departments and troubleshoot technical issues.",
      "Create digital designs and promotional materials for marketing campaigns.",
      "Coordinate with management and internal teams on IT, administrative, and digital initiatives.",
    ],
  },
  {
    role: "Administration & Social Media Manager",
    company: "MBR Facilities Management",
    place: "Editable location",
    date: "Editable dates",
    text: [
      "Manage administrative documentation and records using Google Workspace and Microsoft Office.",
      "Handle client communication and support customer relationship management.",
      "Manage social media platforms and support digital communication activities.",
    ],
  },
  {
    role: "Head of Marketing",
    company: "Progsity",
    place: "Editable location",
    date: "Add dates",
    text: [
      "Add role responsibilities here.",
      "Add specific initiatives and outcomes only when confirmed.",
    ],
  },
];
const skillGroups = [
  {
    title: "IT & Technical",
    icon: Code2,
    items: [
      "IT Support",
      "Technical Troubleshooting",
      "Website Management",
      "Basic Web Development",
      "Data Entry & Data Management",
    ],
  },
  {
    title: "Digital & Design",
    icon: Sparkles,
    items: [
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Canva",
      "Social Media Management",
      "Digital Content Creation",
    ],
  },
  {
    title: "Productivity Tools",
    icon: Layers3,
    items: [
      "Microsoft Word",
      "Microsoft Excel",
      "Microsoft PowerPoint",
      "Google Docs",
      "Google Sheets",
      "Google Drive",
      "Google Forms",
    ],
  },
  {
    title: "Administrative & Professional",
    icon: BriefcaseBusiness,
    items: [
      "Documentation",
      "Record Management",
      "Reporting",
      "Customer Communication",
      "Team Coordination",
      "Problem-Solving",
      "Leadership",
      "Time Management",
    ],
  },
];
const projects = [
  {
    n: "01",
    title: "MU CSE Society Management System",
    type: "Web application",
    desc: "A centralized platform for society notices, events, blogs, gallery content, committee information, and alumni records.",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
    symbol: "M/C",
  },
  {
    n: "02",
    title: "AI-Powered T-Shirt Design Platform",
    type: "AI · Creative tool",
    desc: "A platform for generating and customizing T-shirt designs with AI-powered features.",
    tech: ["React.js", "JavaScript", "CSS", "AI API"],
    symbol: "✳",
  },
  {
    n: "03",
    title: "Student Alcohol Consumption Prediction",
    type: "Machine learning · Academic project",
    desc: "An academic machine-learning project covering data preparation, exploratory analysis, model development, and evaluation.",
    tech: ["Python", "Scikit-learn", "Pandas", "NumPy", "Matplotlib"],
    symbol: "ƒ(x)",
  },
  {
    n: "04",
    title: "Movie Information and Review Platform",
    type: "Web application",
    desc: "Search for movies and explore details including ratings, genres, and reviews.",
    tech: ["PHP", "MySQL", "HTML", "CSS", "JavaScript", "APIs"],
    symbol: "▶",
  },
];
const rise = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

function SectionHeading({ eyebrow, title, text }) {
  return (
    <motion.div
      variants={rise}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="section-heading"
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </motion.div>
  );
}
function App() {
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);
  const [portfolio, setPortfolio] = useState(emptyPortfolio);
  const { projects: portfolioProjects, designs: portfolioDesigns, profile, cv, content: portfolioContent, sections } = portfolio;
  const cvHref = cv.file || "/Mamun-Ahmed-CV.pdf";
  const [activeDesign, setActiveDesign] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formNote, setFormNote] = useState("");
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);
  useEffect(() => {
    loadPortfolio().then((remote) => remote && setPortfolio(remote)).catch((error) => console.error('Could not load portfolio content:', error));
  }, []);
  useEffect(() => {
    const closeOnEscape = (event) => event.key === "Escape" && setActiveDesign(null);
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    setFormNote(
      "Your details are validated. Message sending is not enabled yet—connect an email service or backend before using this form.",
    );
  };
  return (
    <div
      className={`site-shell ${sections
        .filter((section) => !section.visible)
        .map((section) => `hide-section-${section.id}`)
        .join(" ")}`}
    >
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Mamun Ahmed home">
          <span className="brand-mark">
            MAMUN<span> AHMED</span>
          </span>
        </a>
        <nav
          className={`nav-links ${menu ? "nav-open" : ""}`}
          aria-label="Main navigation"
        >
          {nav.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMenu(false)}
            >
              {item}
            </a>
          ))}
          <a className="mobile-cv" href={cvHref} download={cv.name}>
            <Download size={15} /> Download CV
          </a>
        </nav>
        <div className="nav-actions">
          <button
            className="icon-btn theme-toggle"
            onClick={() => setDark(!dark)}
            aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a
            className="button button-small button-primary desktop-cv"
            href={cvHref}
            download={cv.name}
          >
            <Download size={15} /> Download CV
          </a>
          <button
            className="icon-btn menu-toggle"
            onClick={() => setMenu(!menu)}
            aria-label="Toggle navigation"
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main>
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <div className="availability">
              <span className="pulse" /> OPEN TO PROFESSIONAL OPPORTUNITIES
            </div>
            <motion.p
              className="hero-kicker"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Hello, I'm
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
            >
              Mamun
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
            >
              IT & Digital Operations
              <br className="desktop-break" /> Professional
            </motion.h2>
            <motion.p
              className="hero-desc"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
            >
              Bridging technology, operations, and customer experience.
            </motion.p>
            <p className="hero-body">
              I'm a Computer Science and Engineering graduate with professional
              experience in IT support, website management, administration,
              digital marketing, and team coordination. I enjoy solving
              problems, improving workflows, and using technology to make
              everyday operations more effective.
            </p>
            <div className="hero-ctas">
              <a className="button button-primary" href="#projects">
                View My Work <ArrowDownRight size={17} />
              </a>
              <a className="button button-outline" href="#contact">
                Contact Me <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="hero-social">
              <a
                href="https://www.linkedin.com/in/mamun02"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin size={17} /> LinkedIn <ArrowUpRight size={13} />
              </a>
              <span className="social-divider" />
              <span>
                <MapPin size={15} /> Sylhet, Bangladesh
              </span>
            </div>
          </div>
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <div className="profile-card">
              <div className="profile-top">
                <span>PROFILE / 001</span>
                <span className="profile-dot" />
              </div>
              <div className={`photo-placeholder ${profile.photo ? "has-photo" : ""}`}>
                {profile.photo ? <img src={profile.photo} alt="Mamun Ahmed" /> : <><div className="photo-outline"><div className="head-shape" /><div className="body-shape" /></div><span className="photo-label">YOUR PHOTO HERE</span></>}
              </div>
              <div className="profile-bottom">
                <div>
                  <strong>Mamun Ahmed</strong>
                  <span>IT · Operations · Digital</span>
                </div>
                <span className="mini-monogram">MA</span>
              </div>
            </div>
            <div className="floating-chip chip-tech">
              <Code2 size={16} />
              <span>Technology</span>
            </div>
            <div className="floating-chip chip-people">
              <BriefcaseBusiness size={16} />
              <span>People & Process</span>
            </div>
            <div className="visual-caption">
              A versatile skill set
              <br />
              for a connected world.
            </div>
          </motion.div>
          <a className="scroll-cue" href="#about">
            <span className="scroll-icon">
              <ArrowDown size={15} />
            </span>{" "}
            SCROLL TO EXPLORE
          </a>
          <div className="hero-index">
            01 <span>/</span> 06
          </div>
        </section>
        <section className="about section-wrap" id="about">
          <SectionHeading
            eyebrow="A LITTLE ABOUT ME"
            title={
              <>
                Technology-minded.
                <br />
                <em>People-focused.</em>
              </>
            }
            text="A practical mix of technical knowledge, business support, and creative communication."
          />
          <div className="about-grid">
            <motion.div
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="about-copy"
            >
              {portfolioContent.about.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              <a className="text-link" href="#experience">
                Explore my experience <ArrowUpRight size={16} />
              </a>
            </motion.div>
            <div className="about-facts">
              {portfolioContent.about.facts.map((fact, index) => <div className="fact-card" key={`${fact.title}-${index}`}><span className="fact-number">{String(index + 1).padStart(2, "0")}</span><span className="fact-title">{fact.title}</span><p>{fact.text}</p></div>)}
            </div>
          </div>
        </section>
        <section className="experience section-wrap" id="experience">
          <SectionHeading
            eyebrow="WHERE I'VE WORKED"
            title={
              <>
                Professional <em>experience</em>
              </>
            }
            text="Roles and responsibilities across technology, administration, and marketing."
          />
          <div className="timeline">
            {portfolioContent.experiences.map((job, i) => (
              <motion.article
                key={job.role}
                className="experience-card"
                variants={rise}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className="timeline-marker">
                  <span>0{i + 1}</span>
                </div>
                <div className="experience-main">
                  <div className="experience-head">
                    <div>
                      <h3>{job.role}</h3>
                      <div className="company-line">
                        {job.company}
                        <span>·</span>
                        {job.place}
                      </div>
                    </div>
                    <span className="date-pill">{job.date}</span>
                  </div>
                  <ul>
                    {job.text.map((t, j) => (
                      <li key={j}>{t}</li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
          <p className="edit-note">
            Dates and the Progsity role details are editable placeholders—update
            them with confirmed information.
          </p>
        </section>
        <section className="skills section-wrap" id="skills">
          <SectionHeading
            eyebrow="WHAT I BRING"
            title={
              <>
                Skills & <em>toolkit</em>
              </>
            }
            text="A broad, practical toolkit built around technical support, digital work, and getting things organized."
          />
          <div className="skills-grid">
            {portfolioContent.skills.map((group, i) => {
              const Icon = { code: Code2, sparkles: Sparkles, layers: Layers3, briefcase: BriefcaseBusiness }[group.icon] || Code2;
              return (
              <motion.article
                className="skill-card"
                key={group.title}
                variants={rise}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.15 }}
              >
                <div className="skill-card-head">
                  <span className="skill-icon">
                    <Icon size={19} />
                  </span>
                  <span className="skill-index">0{i + 1}</span>
                </div>
                <h3>{group.title}</h3>
                <div className="skill-tags">
                  {group.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </motion.article>
              )
            })}
          </div>
        </section>
        <section className="projects section-wrap" id="projects">
          <SectionHeading
            eyebrow="SELECTED WORK"
            title={
              <>
                Projects & <em>practice</em>
              </>
            }
            text="Academic and personal projects that reflect my interest in building useful digital experiences."
          />
          <div className="projects-grid">
            {portfolioProjects.map((project, i) => (
              <motion.article
                className={`project-card project-${i + 1}`}
                key={project.id || project.n}
                variants={rise}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.12 }}
              >
                <div
                  className="project-art"
                  style={
                    project.cover
                      ? {
                          backgroundImage: `url(${project.cover})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                >
                  <div className="project-art-grid" />
                  <span className="project-art-symbol">{project.symbol}</span>
                  <span className="project-number">PROJECT / {project.n}</span>
                  <span className="project-art-corner">
                    <ArrowUpRight size={20} />
                  </span>
                </div>
                <div className="project-content">
                  <span className="project-type">{project.type}</span>
                  <h3>{project.title}</h3>
                  <p>{project.desc}</p>
                  <div className="tech-tags">
                    {project.tech.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <div className="project-links">
                    {(project.demo || project.repository) && (
                      <a
                        href={project.demo || project.repository}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${project.title} project link`}
                      >
                        Project details <ArrowUpRight size={15} />
                      </a>
                    )}
                    <div className="project-external-links">
                      {project.repository && <a href={project.repository} target="_blank" rel="noreferrer"><Github size={14} /> GitHub</a>}
                      {project.demo && <a href={project.demo} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Live demo</a>}
                      {!project.repository && !project.demo && <span className="no-links"></span>}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
        <section className="designs section-wrap" id="designs">
          <SectionHeading
            eyebrow="DESIGN WORK"
            title={
              <>
                Flyers & <em>visual design</em>
              </>
            }
            text="Promotional flyers and visual communication created for digital and social media use."
          />
          <div className="design-gallery">
            {portfolioDesigns.length ? (
              portfolioDesigns.map((design) => (
                <article
                  className="design-card"
                  key={design.id}
                  onClick={() => setActiveDesign(design)}
                  tabIndex="0"
                  onKeyDown={(event) => event.key === "Enter" && setActiveDesign(design)}
                >
                  <img src={design.image} alt={design.title} />
                  <div>
                    <span>{design.category}</span>
                    <h3>{design.title}</h3>
                  </div>
                </article>
              ))
            ) : (
              <div className="design-empty">
                <Sparkles size={22} />
                <p>Design work will appear here soon.</p>
              </div>
            )}
          </div>
        </section>
        <section className="leadership section-wrap" id="leadership">
          <SectionHeading
            eyebrow="BEYOND THE CLASSROOM"
            title={
              <>
                Leadership & <em>activities</em>
              </>
            }
            text="Student organization roles involving coordination, communication, and campus engagement."
          />
          <div className="leadership-layout">
            <div className="leadership-orgs">
              <motion.article
                className="org-card"
                variants={rise}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <div className="org-heading">
                  <span className="org-symbol">MU</span>
                  <div>
                    <h3>MU CSE Society</h3>
                    <p>Metropolitan University</p>
                  </div>
                </div>
                <div className="role-row">
                  <span>Student Advisor</span>
                  <time>2024–25</time>
                </div>
                <div className="role-row">
                  <span>General Secretary</span>
                  <time>2023–24</time>
                </div>
                <div className="role-row">
                  <span>Office Secretary</span>
                  <time>2022–23</time>
                </div>
                <div className="role-row">
                  <span>Executive Member</span>
                  <time>2021–22</time>
                </div>
                
              </motion.article>
              <motion.article
                className="org-card"
                variants={rise}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <div className="org-heading">
                  <span className="org-symbol org-symbol-alt">SS</span>
                  <div>
                    <h3>MU Social Services Club</h3>
                    <p>Metropolitan University</p>
                  </div>
                </div>
                <div className="role-row">
                  <span>Organizing Secretary</span>
                  <time>2022–23</time>
                </div>
                <div className="role-row">
                  <span>Office Secretary</span>
                  <time>2021–22</time>
                </div>
              </motion.article>
            </div>
            {portfolioContent.leadership.organizations.slice(2).map((organization) => (
              <motion.article className="org-card" key={organization.name} variants={rise} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <div className="org-heading"><span className={`org-symbol ${organization.tone === "alt" ? "org-symbol-alt" : ""}`}>{organization.symbol}</span><div><h3>{organization.name}</h3><p>{organization.institution}</p></div></div>
                {organization.roles.map((role, index) => <div className="role-row" key={`${role.title}-${index}`}><span>{role.title}</span><time>{role.date}</time></div>)}
              </motion.article>
            ))}
            <motion.div
              className="achievement-card"
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <span className="achievement-label">COMPETITION ACHIEVEMENT</span>
              <div className="trophy-mark">Ⅱ</div>
              <span className="achievement-place">RUNNER-UP</span>
              <h3>MU Robo Fest 2022</h3>
              <p>Line Following Robot Competition</p>
              <div className="achievement-line" />
              <p className="achievement-foot">Team competition · 2022</p>
            </motion.div>
          </div>
          <div className="leadership-note">
            <span>EXPERIENCE HIGHLIGHTS</span>
            <p>
              Event planning <i /> Team coordination <i /> Communication <i />{" "}
              Organizational responsibilities <i /> Student engagement
            </p>
          </div>
        </section>
        <section className="contact section-wrap" id="contact">
          <div className="contact-banner">
            <div className="contact-copy">
              <span className="eyebrow">LET'S CONNECT</span>
              <h2>
                Have a role or project
                <br />
                <em>in mind?</em>
              </h2>
              <p>{portfolioContent.contact.intro}</p>
              <div className="contact-details">
                <a href={`mailto:${portfolioContent.contact.email}`}>
                  <span className="contact-icon">
                    <Mail size={17} />
                  </span>
                  <span>
                    <small>EMAIL ME</small>{portfolioContent.contact.email}
                  </span>
                  <ArrowUpRight size={16} />
                </a>
                <a href={`tel:${portfolioContent.contact.phone.replace(/\s/g, "")}`}>
                  <span className="contact-icon">
                    <Phone size={17} />
                  </span>
                  <span>
                    <small>CALL ME</small>{portfolioContent.contact.phone}
                  </span>
                  <ArrowUpRight size={16} />
                </a>
                <a
                  href={portfolioContent.contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="contact-icon">
                    <Linkedin size={17} />
                  </span>
                  <span>
                    <small>CONNECT ON LINKEDIN</small>{portfolioContent.contact.linkedinLabel}
                  </span>
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
            <form className="contact-form" onSubmit={submit}>
              <div className="form-heading">
                <span>01 / SEND A MESSAGE</span>
                <p>All fields are required.</p>
              </div>
              <label>
                Your name
                <input
                  name="name"
                  value={form.name}
                  onChange={update}
                  required
                  placeholder="Full name"
                />
              </label>
              <label>
                Email address
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={update}
                  required
                  placeholder="you@example.com"
                />
              </label>
              <label>
                Subject
                <input
                  name="subject"
                  value={form.subject}
                  onChange={update}
                  required
                  placeholder="What would you like to discuss?"
                />
              </label>
              <label>
                Message
                <textarea
                  name="message"
                  value={form.message}
                  onChange={update}
                  required
                  rows="4"
                  placeholder="Write your message here…"
                />
              </label>
              <button
                className="button button-primary form-submit"
                type="submit"
              >
                Validate message <Send size={16} />
              </button>
              {formNote && (
                <p className="form-note" role="status">
                  {formNote}
                </p>
              )}
              <p className="form-disclaimer">
                This form currently validates your entries only. Email delivery
                requires a configured backend or email service.
              </p>
            </form>
          </div>
          <div className="contact-location">
            <MapPin size={15} /> Based in {portfolioContent.contact.location} <span /> {portfolioContent.contact.availability}
          </div>
        </section>
      </main>
      {activeDesign && (
        <div className="design-lightbox" role="dialog" aria-modal="true" aria-label={activeDesign.title} onClick={() => setActiveDesign(null)}>
          <button className="design-lightbox-close" onClick={() => setActiveDesign(null)} aria-label="Close full design view"><X size={22} /></button>
          <figure onClick={(event) => event.stopPropagation()}>
            <img src={activeDesign.image} alt={activeDesign.title} />
            <figcaption>{activeDesign.title}</figcaption>
          </figure>
        </div>
      )}
      <footer className="footer">
        <a className="brand" href="#home">
          <span className="brand-mark">
            M<span>.</span>
          </span>
          <span className="brand-name">Mamun Ahmed</span>
        </a>
        <p>Technology, operations, and thoughtful execution.</p>
        <nav aria-label="Footer navigation">
          {nav.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}>
              {item}
            </a>
          ))}
        </nav>
        <a
          className="footer-linkedin"
          href="https://www.linkedin.com/in/mamun02"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          <Linkedin size={17} />
        </a>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Mamun Ahmed. All rights reserved.
          </span>
          <a href="#home">BACK TO TOP ↑</a>
        </div>
      </footer>
    </div>
  );
}
export default App;
