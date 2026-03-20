# 4C Research Group Website

A modern research group website for the 4C (Covert Consciousness and Critical Care) Research Group, built with Next.js and deployed on GitHub Pages.

## Overview

This website showcases the research activities, team members, publications, and collaboration opportunities of the 4C Research Group, focusing on:

- Neuroprognostication in acute disorders of consciousness
- ICU delirium and sleep deprivation research
- Quantitative EEG monitoring
- Pain and comfort in pediatric critical care

## Features

- **Modern UI/UX**: Built with Next.js, TypeScript, and Tailwind CSS
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Interactive Elements**: Smooth animations using Framer Motion
- **Research Themes**: Detailed sections for each research area
- **Team Management**: Current members and alumni sections
- **Publications**: Searchable and filterable publication database
- **Collaboration Portal**: Information for potential partners
- **GitHub Pages Deployment**: Static site generation for easy hosting

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/[username]/4c-research-website.git
cd 4c-research-website
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── research/
│   │   └── page.tsx          # Research themes and projects
│   ├── team/
│   │   └── page.tsx          # Team members and alumni
│   ├── publications/
│   │   └── page.tsx          # Publications and presentations
│   ├── collaborate/
│   │   └── page.tsx          # Collaboration opportunities
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   └── Navbar.tsx            # Navigation component
└── ...
```

## Customization

### Updating Content

1. **Research Themes**: Edit `src/app/research/page.tsx` to update research projects and themes
2. **Team Members**: Modify `src/app/team/page.tsx` to add or update team information
3. **Publications**: Update `src/app/publications/page.tsx` to add new publications
4. **Contact Information**: Edit `src/app/collaborate/page.tsx` for collaboration details

### Styling

The website uses Tailwind CSS for styling. You can customize colors, fonts, and layouts by:

- Modifying `tailwind.config.js` (create if needed)
- Updating utility classes in component files
- Editing `src/app/globals.css` for global styles

### Adding Images

1. Place images in the `public/` directory
2. Reference them using relative paths (e.g., `/images/photo.jpg`)
3. Update the relevant components to include the new images

## Deployment

### GitHub Pages

This project is configured for static export and GitHub Pages deployment:

1. **Update Configuration**:
   - Edit `package.json` and replace `[username]` with your GitHub username
   - Update `next.config.js` if your repository name differs

2. **Deploy to GitHub Pages**:

```bash
npm run deploy
```

This command will:

- Build the Next.js application
- Export static files
- Deploy to the `gh-pages` branch
- Make the site available at `https://[username].github.io/4c-research-website`

3. **Enable GitHub Pages**:
   - Go to your repository settings on GitHub
   - Scroll to the "GitHub Pages" section
   - Select "gh-pages" branch as the source
   - Your site will be published automatically

### Manual Deployment

For manual deployment:

```bash
npm run build
npm run export
# The static files will be in the 'out' directory
```

## Environment Variables

Create a `.env.local` file for environment-specific variables:

```env
NEXT_PUBLIC_GITHUB_USERNAME=your-username
NEXT_PUBLIC_CONTACT_EMAIL=contact@4clab.ca
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Technologies Used

- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **gh-pages**: GitHub Pages deployment tool

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or collaboration opportunities:

- Email: research@4clab.ca
- GitHub: [Create an issue](https://github.com/[username]/4c-research-website/issues)

---

**Note**: Replace `[username]` with your actual GitHub username in the configuration files and documentation.
