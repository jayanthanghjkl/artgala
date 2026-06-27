/**
 * skills.js
 * Clean, updateable data module containing the complete configuration
 * for the staggered skills grid, including standard skills, bento panels, and backgrounds.
 */

// Bento Items (Expandable Accordion Cards)
export const skillsBentoItems = [
  {
    id: 'languages',
    title: 'Languages',
    subtitle: 'Core Logic & Web',
    description: 'Java, C, TypeScript, JavaScript ES6+, Dart, HTML5, CSS3, SQL',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    iconType: 'languages'
  },
  {
    id: 'frameworks',
    title: 'Frameworks & Web',
    subtitle: 'Scalable Systems',
    description: 'Next.js, React.js, Flutter, Tailwind CSS, Turborepo, Node.js',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    iconType: 'frameworks'
  },
  {
    id: 'tools',
    title: 'Tools & DevOps',
    subtitle: 'Deployments & Assets',
    description: 'Git, GitHub Actions, Jenkins, Vercel, Figma, Blender, Docker',
    image: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=800&q=80',
    iconType: 'tools'
  }
];

// Decorative Grid Card Images (Fallback background assets)
export const skillsGridImages = [
  'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1541462608141-2f58c6c6840d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
];

// Standard Skills List (Dynamically populates the small grid cards)
// Add, remove, or modify elements here to customize the list of skills shown.
export const skillsList = [
  { name: 'Java', iconType: 'Java' },
  { name: 'C', iconType: 'C' },
  { name: 'TypeScript', iconType: 'TypeScript' },
  { name: 'JavaScript', iconType: 'JavaScript' },
  { name: 'Dart', iconType: 'Dart' },
  { name: 'HTML5', iconType: 'Html5' },
  { name: 'CSS3', iconType: 'Css3Alt' },
  { name: 'SQL', iconType: 'Postgresql' },
  { name: 'Next.js', iconType: 'NextJs' },
  { name: 'React.js', iconType: 'React' },
  { name: 'Flutter', iconType: 'Flutter' },
  { name: 'Tailwind CSS', iconType: 'TailwindCSS' },
  { name: 'Turborepo', iconType: 'Turborepo' },
  { name: 'Git', iconType: 'Git' },
  { name: 'GitHub Actions', iconType: 'GithubActions' },
  { name: 'Vercel', iconType: 'Vercel' },
  { name: 'Figma', iconType: 'Figma' },
  { name: 'Blender', iconType: 'Blender' }
];
