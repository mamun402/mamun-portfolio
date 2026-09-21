import { useState } from "react";
import {
  Check,
  Edit3,
  ImagePlus,
  LayoutDashboard,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import {
  initialDesigns,
  initialCv,
  initialProjects,
  initialProfile,
  initialContent,
  readStored,
  readSections,
} from "../content.js";

const emptyProject = {
  title: "",
  type: "Web application",
  desc: "",
  tech: "",
  symbol: "✦",
  cover: "",
  gallery: [],
  repository: "",
  demo: "",
};
const imageToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, 1400 / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas
          .getContext("2d")
          .drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      image.onerror = reject;
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
const compactDataUrl = (dataUrl) =>
  new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, 1400 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas
        .getContext("2d")
        .drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.78));
    };
    image.onerror = () => resolve(dataUrl);
    image.src = dataUrl;
  });

export default function AdminPanel() {
  const [projects, setProjects] = useState(() =>
    readStored("mamun-projects", initialProjects),
  );
  const [designs, setDesigns] = useState(() =>
    readStored("mamun-designs", initialDesigns),
  );
  const [profile, setProfile] = useState(() =>
    readStored("mamun-profile", initialProfile),
  );
  const [cv, setCv] = useState(() => readStored("mamun-cv", initialCv));
  const [sections, setSections] = useState(readSections);
  const [content, setContent] = useState(() =>
    readStored("mamun-content", initialContent),
  );
  const [tab, setTab] = useState("sections");
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(emptyProject);
  const [designTitle, setDesignTitle] = useState("");
  const [message, setMessage] = useState("");

  const persistContent = (next) => {
    setContent(next);
    localStorage.setItem("mamun-content", JSON.stringify(next));
    setMessage("Saved to this browser");
  };
  const updateContentList = (key, index, value) =>
    setContent((current) => ({
      ...current,
      [key]: current[key].map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
  const saveContent = () => {
    localStorage.setItem("mamun-content", JSON.stringify(content));
    setMessage("Saved to this browser");
  };
  const addContentItem = (key, item) =>
    setContent((current) => ({ ...current, [key]: [...current[key], item] }));
  const removeContentItem = (key, index) =>
    setContent((current) => ({
      ...current,
      [key]: current[key].filter((_, itemIndex) => itemIndex !== index),
    }));

  const persistProjects = (next) => {
    setProjects(next);
    localStorage.setItem("mamun-projects", JSON.stringify(next));
    setMessage("Saved to this browser");
  };
  const persistSections = (next) => {
    setSections(next);
    localStorage.setItem("mamun-sections", JSON.stringify(next));
    setMessage("Saved to this browser");
  };
  const persistProfile = (next) => {
    try {
      localStorage.setItem("mamun-profile", JSON.stringify(next));
      setProfile(next);
      setMessage("Profile photo saved");
    } catch {
      setMessage("This image is too large for browser storage. Try a smaller image.");
    }
  };
  const persistCv = (next) => {
    try {
      localStorage.setItem("mamun-cv", JSON.stringify(next));
      setCv(next);
      setMessage("CV saved");
    } catch {
      setMessage("This PDF is too large for browser storage. Try a smaller file.");
    }
  };
  const persistDesigns = (next) => {
    try {
      localStorage.setItem("mamun-designs", JSON.stringify(next));
      setDesigns(next);
      setMessage("Saved to this browser");
    } catch {
      setMessage(
        "This image is too large for browser storage. Try a smaller image.",
      );
    }
  };
  const editProject = (project) => {
    setTab("projects");
    setEditing(project?.id || "new");
    setDraft(
      project ? { ...project, tech: project.tech.join(", ") } : emptyProject,
    );
  };
  const saveProject = (event) => {
    event.preventDefault();
    const data = {
      ...draft,
      tech: draft.tech
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      gallery: draft.gallery || [],
    };
    const next =
      editing === "new"
        ? [
            ...projects,
            {
              ...data,
              id: crypto.randomUUID(),
              n: String(projects.length + 1).padStart(2, "0"),
            },
          ]
        : projects.map((project) =>
            project.id === editing ? { ...data, id: editing } : project,
          );
    persistProjects(next);
    setEditing(null);
    setDraft(emptyProject);
  };
  const deleteProject = (id) => {
    if (window.confirm("Delete this project?"))
      persistProjects(projects.filter((project) => project.id !== id));
  };
  const updateCover = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const cover = await imageToDataUrl(file);
    setDraft((current) => ({ ...current, cover }));
    event.target.value = "";
  };
  const uploadDesigns = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const existing = await Promise.all(
      designs.map(async (design) => ({
        ...design,
        image: await compactDataUrl(design.image),
      })),
    );
    const images = await Promise.all(files.map(imageToDataUrl));
    const next = [
      ...existing,
      ...images.map((image, index) => ({
        id: crypto.randomUUID(),
        title: designTitle.trim() || files[index].name.replace(/\.[^/.]+$/, ""),
        category: "Flyer design",
        image,
      })),
    ];
    persistDesigns(next);
    setDesignTitle("");
    event.target.value = "";
  };
  const deleteDesign = (id) => {
    if (window.confirm("Delete this flyer design?"))
      persistDesigns(designs.filter((design) => design.id !== id));
  };
  const updateProfilePhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    persistProfile({ photo: await imageToDataUrl(file) });
    event.target.value = "";
  };
  const updateCv = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => persistCv({ file: reader.result, name: file.name });
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  return (
    <div className="admin-page">
      <header className="admin-topbar">
        <div>
          <span className="admin-label">PRIVATE CONTENT MANAGER</span>
          <h1>Portfolio admin</h1>
        </div>
        <a className="admin-public-link" href="/">
          View portfolio
        </a>
      </header>
      <main className="admin-layout">
        <aside className="admin-sidebar">
          <button
            className={tab === "sections" ? "active" : ""}
            onClick={() => setTab("sections")}
          >
            <LayoutDashboard size={16} /> Sections
          </button>
          <button
            className={tab === "projects" ? "active" : ""}
            onClick={() => setTab("projects")}
          >
            <ImagePlus size={16} /> Projects & gallery
          </button>
          <button className={tab === "about" ? "active" : ""} onClick={() => setTab("about")}><Edit3 size={16} /> About</button>
          <button className={tab === "experience" ? "active" : ""} onClick={() => setTab("experience")}><Edit3 size={16} /> Experience</button>
          <button className={tab === "skills" ? "active" : ""} onClick={() => setTab("skills")}><Edit3 size={16} /> Skills</button>
          <button className={tab === "leadership" ? "active" : ""} onClick={() => setTab("leadership")}><Edit3 size={16} /> Leadership</button>
          <button className={tab === "contact" ? "active" : ""} onClick={() => setTab("contact")}><Edit3 size={16} /> Contact information</button>
          <button
            className={tab === "designs" ? "active" : ""}
            onClick={() => setTab("designs")}
          >
            <ImagePlus size={16} /> Flyer designs
          </button>
          <button
            className={tab === "profile" ? "active" : ""}
            onClick={() => setTab("profile")}
          >
            <Upload size={16} /> Profile photo
          </button>
          <button
            className={tab === "cv" ? "active" : ""}
            onClick={() => setTab("cv")}
          >
            <Upload size={16} /> CV file
          </button>
          <p>
            Admin is available only at this private URL. Content is stored in
            this browser.
          </p>
        </aside>
        <section className="admin-content">
          {message && (
            <div className="admin-toast">
              <Check size={14} /> {message}
            </div>
          )}
          {tab === "sections" && (
            <>
              <div className="admin-title">
                <span>PAGE STRUCTURE</span>
                <h2>Show or hide sections</h2>
                <p>Control which public portfolio sections are visible.</p>
              </div>
              <div className="section-settings">
                {sections.map((section) => (
                  <div className="section-setting" key={section.id}>
                    <div>
                      <strong>{section.label}</strong>
                      <small>/{section.id}</small>
                    </div>
                    <button
                      className={`admin-switch ${section.visible ? "on" : ""}`}
                      onClick={() =>
                        persistSections(
                          sections.map((item) =>
                            item.id === section.id
                              ? { ...item, visible: !item.visible }
                              : item,
                          ),
                        )
                      }
                      aria-label={`Toggle ${section.label}`}
                    >
                      <span>{section.visible && <Check size={12} />}</span>
                    </button>
                  </div>
                ))}
              </div>
              <div className="admin-note">
                <strong>Editing additional sections</strong>
                <p>
                  The built-in sections are controlled here. Project details and
                  design uploads are managed in the other tabs.
                </p>
              </div>
            </>
          )}
          {tab === "profile" && (
            <>
              <div className="admin-title">
                <span>PROFILE MEDIA</span>
                <h2>Profile photo</h2>
                <p>Upload or replace the photo shown in the hero profile card.</p>
              </div>
              <div className="profile-photo-admin">
                {profile.photo ? <img src={profile.photo} alt="Current profile" /> : <div className="profile-photo-empty">No profile photo uploaded</div>}
                <label className="design-upload">
                  <input type="file" accept="image/*" onChange={updateProfilePhoto} />
                  <Upload size={17} /> {profile.photo ? "Replace profile photo" : "Upload profile photo"}
                </label>
                {profile.photo && <button className="admin-delete-photo" onClick={() => persistProfile({ photo: "" })}><Trash2 size={14} /> Remove photo</button>}
              </div>
            </>
          )}
          {tab === "cv" && (
            <>
              <div className="admin-title">
                <span>DOWNLOADABLE DOCUMENT</span>
                <h2>CV file</h2>
                <p>Upload or replace the PDF used by the public Download CV buttons.</p>
              </div>
              <div className="cv-admin-box">
                <strong>{cv.file ? cv.name : "Default CV path is active"}</strong>
                <small>{cv.file ? "This uploaded file is used on the public portfolio." : "Upload a PDF to replace the default file."}</small>
                <label className="design-upload">
                  <input type="file" accept="application/pdf,.pdf" onChange={updateCv} />
                  <Upload size={17} /> {cv.file ? "Replace CV" : "Upload CV"}
                </label>
                {cv.file && <button className="admin-delete-photo" onClick={() => persistCv(initialCv)}><Trash2 size={14} /> Use default CV</button>}
              </div>
            </>
          )}
          {tab === "designs" && (
            <>
              <div className="admin-title">
                <span>VISUAL LIBRARY</span>
                <h2>Flyer designs</h2>
                <p>
                  Enter a title, then choose a flyer. It will appear in the
                  public Designs section.
                </p>
              </div>
              <label className="design-title-field">
                Flyer title
                <input
                  value={designTitle}
                  onChange={(event) => setDesignTitle(event.target.value)}
                  placeholder="Example: Eid campaign flyer"
                />
              </label>
              <label className="design-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadDesigns}
                />
                <ImagePlus size={17} /> Upload flyer designs
              </label>
              <div className="design-admin-grid">
                {designs.map((design) => (
                  <article key={design.id}>
                    <img src={design.image} alt={design.title} />
                    <div>
                      <strong>{design.title}</strong>
                      <small>{design.category}</small>
                    </div>
                    <button
                      className="danger"
                      onClick={() => deleteDesign(design.id)}
                      aria-label={`Delete ${design.title}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}
          {tab === "about" && (
            <form className="project-form" onSubmit={(event) => { event.preventDefault(); saveContent(); }}>
              <h3>Edit about section</h3>
              <label>Paragraphs (one paragraph per line)<textarea rows="9" value={content.about.paragraphs.join("\n")} onChange={(event) => setContent({ ...content, about: { ...content.about, paragraphs: event.target.value.split("\n").filter(Boolean) } })} /></label>
              <label>Fact cards (one per line: Title | Description)<textarea rows="5" value={content.about.facts.map((fact) => `${fact.title} | ${fact.text}`).join("\n")} onChange={(event) => setContent({ ...content, about: { ...content.about, facts: event.target.value.split("\n").filter(Boolean).map((line) => { const [title, ...text] = line.split("|"); return { title: title.trim(), text: text.join("|").trim() }; }) } })} /></label>
              <div className="form-actions"><button className="save-button" type="submit"><Save size={14} /> Save about</button></div>
            </form>
          )}
          {tab === "experience" && (
            <>
              <div className="admin-title"><span>CAREER HISTORY</span><h2>Experience</h2><p>Add, edit, or delete professional roles.</p></div>
              {content.experiences.map((job, index) => <div className="project-form" key={index}><h3>Experience {index + 1}</h3><label>Role<input value={job.role} onChange={(event) => updateContentList("experiences", index, { ...job, role: event.target.value })} /></label><label>Company<input value={job.company} onChange={(event) => updateContentList("experiences", index, { ...job, company: event.target.value })} /></label><label>Location<input value={job.place} onChange={(event) => updateContentList("experiences", index, { ...job, place: event.target.value })} /></label><label>Dates<input value={job.date} onChange={(event) => updateContentList("experiences", index, { ...job, date: event.target.value })} /></label><label>Responsibilities (one per line)<textarea rows="5" value={job.text.join("\n")} onChange={(event) => updateContentList("experiences", index, { ...job, text: event.target.value.split("\n").filter(Boolean) })} /></label><div className="form-actions"><button type="button" className="admin-delete-photo" onClick={() => removeContentItem("experiences", index)}><Trash2 size={14} /> Delete</button></div></div>)}
              <button className="admin-add" onClick={() => addContentItem("experiences", { role: "New role", company: "", place: "", date: "", text: [] })}><Plus size={16} /> Add experience</button><button className="admin-add" onClick={saveContent}><Save size={16} /> Save experience</button>
            </>
          )}
          {tab === "skills" && (
            <>
              <div className="admin-title"><span>SKILL GROUPS</span><h2>Skills</h2><p>Add, edit, or delete skill groups and their tags.</p></div>
              {content.skills.map((skill, index) => <div className="project-form" key={index}><h3>Skill group {index + 1}</h3><label>Title<input value={skill.title} onChange={(event) => updateContentList("skills", index, { ...skill, title: event.target.value })} /></label><label>Skills (one per line)<textarea rows="5" value={skill.items.join("\n")} onChange={(event) => updateContentList("skills", index, { ...skill, items: event.target.value.split("\n").filter(Boolean) })} /></label><div className="form-actions"><button type="button" className="admin-delete-photo" onClick={() => removeContentItem("skills", index)}><Trash2 size={14} /> Delete</button></div></div>)}
              <button className="admin-add" onClick={() => addContentItem("skills", { title: "New skill group", icon: "code", items: [] })}><Plus size={16} /> Add skill group</button><button className="admin-add" onClick={saveContent}><Save size={16} /> Save skills</button>
            </>
          )}
          {tab === "leadership" && (
            <>
              <div className="admin-title"><span>ACTIVITIES</span><h2>Leadership</h2><p>Add, edit, or delete organizations and roles.</p></div>
              {content.leadership.organizations.map((organization, index) => <div className="project-form" key={index}><h3>Organization {index + 1}</h3><label>Name<input value={organization.name} onChange={(event) => setContent({ ...content, leadership: { ...content.leadership, organizations: content.leadership.organizations.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item) } })} /></label><label>Institution<input value={organization.institution} onChange={(event) => setContent({ ...content, leadership: { ...content.leadership, organizations: content.leadership.organizations.map((item, itemIndex) => itemIndex === index ? { ...item, institution: event.target.value } : item) } })} /></label><label>Roles (one per line: Role | Date)<textarea rows="5" value={organization.roles.map((role) => `${role.title} | ${role.date}`).join("\n")} onChange={(event) => setContent({ ...content, leadership: { ...content.leadership, organizations: content.leadership.organizations.map((item, itemIndex) => itemIndex === index ? { ...item, roles: event.target.value.split("\n").filter(Boolean).map((line) => { const [title, ...date] = line.split("|"); return { title: title.trim(), date: date.join("|").trim() }; }) } : item) } })} /></label><div className="form-actions"><button type="button" className="admin-delete-photo" onClick={() => setContent({ ...content, leadership: { ...content.leadership, organizations: content.leadership.organizations.filter((_, itemIndex) => itemIndex !== index) } })}><Trash2 size={14} /> Delete</button></div></div>)}
              <button className="admin-add" onClick={() => setContent({ ...content, leadership: { ...content.leadership, organizations: [...content.leadership.organizations, { name: "New organization", institution: "", symbol: "LO", tone: "default", roles: [] }] } })}><Plus size={16} /> Add organization</button><button className="admin-add" onClick={saveContent}><Save size={16} /> Save leadership</button>
            </>
          )}
          {tab === "contact" && (
            <form className="project-form" onSubmit={(event) => { event.preventDefault(); saveContent(); }}><h3>Edit contact information</h3>{[["email", "Email"], ["phone", "Phone"], ["linkedin", "LinkedIn URL"], ["linkedinLabel", "LinkedIn label"], ["location", "Location"], ["availability", "Availability text"]].map(([key, label]) => <label key={key}>{label}<input value={content.contact[key]} onChange={(event) => setContent({ ...content, contact: { ...content.contact, [key]: event.target.value } })} /></label>)}<label>Introductory text<textarea rows="4" value={content.contact.intro} onChange={(event) => setContent({ ...content, contact: { ...content.contact, intro: event.target.value } })} /></label><div className="form-actions"><button className="save-button" type="submit"><Save size={14} /> Save contact</button></div></form>
          )}
          {tab === "projects" && (
            <>
              <div className="admin-title">
                <span>WORK LIBRARY</span>
                <h2>Projects</h2>
                <p>
                  Add, edit, or delete projects and their cover images.
                </p>
              </div>
              <div className="project-admin-list">
                {projects.map((project) => (
                  <div
                    className="project-admin-row"
                    key={project.id}
                  >
                    <div className="project-admin-cover">
                      {project.cover ? (
                        <img src={project.cover} alt="" />
                      ) : (
                        project.symbol
                      )}
                    </div>
                    <div>
                      <strong>{project.title}</strong>
                      <small>Project entry</small>
                    </div>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        editProject(project);
                      }}
                      aria-label={`Edit ${project.title}`}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      className="danger"
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteProject(project.id);
                      }}
                      aria-label={`Delete ${project.title}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button className="admin-add" onClick={() => editProject()}>
                <Plus size={16} /> Add project
              </button>
              {editing && (
                <form className="project-form" onSubmit={saveProject}>
                  <h3>{editing === "new" ? "New project" : "Edit project"}</h3>
                  <label>
                    Title
                    <input
                      required
                      value={draft.title}
                      onChange={(event) =>
                        setDraft({ ...draft, title: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    Type
                    <input
                      value={draft.type}
                      onChange={(event) =>
                        setDraft({ ...draft, type: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    Description
                    <textarea
                      required
                      rows="4"
                      value={draft.desc}
                      onChange={(event) =>
                        setDraft({ ...draft, desc: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    Technology tags
                    <input
                      value={draft.tech}
                      onChange={(event) =>
                        setDraft({ ...draft, tech: event.target.value })
                      }
                      placeholder="React, CSS, Figma"
                    />
                  </label>
                  <label>
                    Symbol
                    <input
                      value={draft.symbol}
                      onChange={(event) =>
                        setDraft({ ...draft, symbol: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    GitHub repository URL
                    <input
                      type="url"
                      value={draft.repository || ""}
                      onChange={(event) =>
                        setDraft({ ...draft, repository: event.target.value })
                      }
                      placeholder="https://github.com/username/project"
                    />
                  </label>
                  <label>
                    Live demo URL
                    <input
                      type="url"
                      value={draft.demo || ""}
                      onChange={(event) =>
                        setDraft({ ...draft, demo: event.target.value })
                      }
                      placeholder="https://example.com"
                    />
                  </label>
                  <label className="upload-control">
                    <span>Cover image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={updateCover}
                    />
                    {draft.cover && (
                      <img src={draft.cover} alt="Cover preview" />
                    )}
                    <span className="upload-action">
                      <Upload size={14} /> Choose image
                    </span>
                  </label>
                  <div className="form-actions">
                    <button type="button" onClick={() => setEditing(null)}>
                      Cancel
                    </button>
                    <button className="save-button" type="submit">
                      <Save size={14} /> Save project
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
