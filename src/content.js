export const initialProjects = [
  { id: 'project-1', n: '01', title: 'MU CSE Society Management System', type: 'Web application', desc: 'A centralized platform for society notices, events, blogs, gallery content, committee information, and alumni records.', tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'], symbol: 'M/C', cover: '', gallery: [] },
  { id: 'project-2', n: '02', title: 'AI-Powered T-Shirt Design Platform', type: 'AI · Creative tool', desc: 'A platform for generating and customizing T-shirt designs with AI-powered features.', tech: ['React.js', 'JavaScript', 'CSS', 'AI API'], symbol: '✳', cover: '', gallery: [] },
  { id: 'project-3', n: '03', title: 'Student Alcohol Consumption Prediction', type: 'Machine learning · Academic project', desc: 'An academic machine-learning project covering data preparation, exploratory analysis, model development, and evaluation.', tech: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib'], symbol: 'ƒ(x)', cover: '', gallery: [] },
  { id: 'project-4', n: '04', title: 'Movie Information and Review Platform', type: 'Web application', desc: 'Search for movies and explore details including ratings, genres, and reviews.', tech: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'APIs'], symbol: '▶', cover: '', gallery: [] },
]

export const initialSections = ['home', 'about', 'experience', 'skills', 'projects', 'leadership', 'contact'].map(id => ({
  id,
  label: id === 'home' ? 'Home / hero' : id[0].toUpperCase() + id.slice(1),
  visible: true,
}))

export const initialDesigns = []
export const initialProfile = { photo: '' }
export const initialCv = { file: '', name: 'Mamun Ahmed CV.pdf' }

export const initialContent = {
  about: {
    paragraphs: [
      'I have a background in Computer Science and Engineering from Metropolitan University, Sylhet, and hands-on experience spanning IT, administration, marketing, and customer-facing responsibilities.',
      'My work has given me opportunities to maintain digital platforms, support day-to-day operations, organize information, create promotional content, and collaborate with different teams. I value clear communication, adaptability, and continuous learning.',
      "I'm interested in roles where technology and thoughtful execution come together to make services and workflows work better.",
    ],
    facts: [
      { title: 'Technical foundation', text: 'Computer Science & Engineering' },
      { title: 'Cross-functional experience', text: 'IT, administration, marketing & service' },
      { title: 'Working style', text: 'Adaptable, organized & collaborative' },
    ],
  },
  experiences: [
    { role: 'IT Manager', company: 'Hotel Valley Garden', place: 'Sylhet, Bangladesh', date: 'Editable dates', text: ['Manage the hotel website and digital platforms, ensuring accurate information, regular updates, and smooth operation.', 'Provide IT support across departments and troubleshoot technical issues.', 'Create digital designs and promotional materials for marketing campaigns.', 'Coordinate with management and internal teams on IT, administrative, and digital initiatives.'] },
    { role: 'Administration & Social Media Manager', company: 'MBR Facilities Management', place: 'Editable location', date: 'Editable dates', text: ['Manage administrative documentation and records using Google Workspace and Microsoft Office.', 'Handle client communication and support customer relationship management.', 'Manage social media platforms and support digital communication activities.'] },
    { role: 'Head of Marketing', company: 'Progsity', place: 'Editable location', date: 'Add dates', text: ['Add role responsibilities here.', 'Add specific initiatives and outcomes only when confirmed.'] },
  ],
  skills: [
    { title: 'IT & Technical', icon: 'code', items: ['IT Support', 'Technical Troubleshooting', 'Website Management', 'Basic Web Development', 'Data Entry & Data Management'] },
    { title: 'Digital & Design', icon: 'sparkles', items: ['Adobe Photoshop', 'Adobe Illustrator', 'Canva', 'Social Media Management', 'Digital Content Creation'] },
    { title: 'Productivity Tools', icon: 'layers', items: ['Microsoft Word', 'Microsoft Excel', 'Microsoft PowerPoint', 'Google Docs', 'Google Sheets', 'Google Drive', 'Google Forms'] },
    { title: 'Administrative & Professional', icon: 'briefcase', items: ['Documentation', 'Record Management', 'Reporting', 'Customer Communication', 'Team Coordination', 'Problem-Solving', 'Leadership', 'Time Management'] },
  ],
  leadership: {
    organizations: [
      { name: 'MU CSE Society', institution: 'Metropolitan University', symbol: 'MU', tone: 'default', roles: [{ title: 'General Secretary', date: '2023–24' }, { title: 'Office Secretary', date: '2022–23' }, { title: 'Executive Member', date: '2021–22' }, { title: 'Student Advisor', date: '2024–25' }] },
      { name: 'MU Social Services Club', institution: 'Metropolitan University', symbol: 'SS', tone: 'alt', roles: [{ title: 'Organizing Secretary', date: '2022–23' }, { title: 'Office Secretary', date: '2021–22' }] },
    ],
    achievement: { label: 'COMPETITION ACHIEVEMENT', place: 'RUNNER-UP', title: 'MU Robo Fest 2022', description: 'Line Following Robot Competition', foot: 'Team competition · 2022' },
    highlights: ['Event planning', 'Team coordination', 'Communication', 'Organizational responsibilities', 'Student engagement'],
  },
  contact: { intro: "I'm open to discussing opportunities where my experience in IT, digital operations, administration, and marketing can be useful.", email: 'mamun180@outlook.com', phone: '+880 17 2128 2700', linkedin: 'https://www.linkedin.com/in/mamun02', linkedinLabel: 'linkedin.com/in/mamun02', location: 'Sylhet, Bangladesh', availability: 'Available for professional conversations' },
}

export function readSections() {
  const stored = readStored('mamun-sections', initialSections)
  const known = new Set(stored.map(section => section.id))
  return known.has('designs') ? stored : [...stored, { id: 'designs', label: 'Flyer designs', visible: true }]
}

export function readStored(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}
