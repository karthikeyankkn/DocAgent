# DocAgent - Local AI Document Chat

> Chat with your PDF documents using 100% local AI. No data leaves your browser. Privacy-first document intelligence.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)

---

## 📑 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

---

## 🎯 Overview

**DocAgent** is a modern, privacy-focused document intelligence application that enables you to chat with your PDF documents using AI-powered RAG (Retrieval-Augmented Generation) technology. Unlike cloud-based solutions, DocAgent processes everything locally in your browser, ensuring your sensitive documents never leave your device.

The application combines advanced PDF processing, vector embeddings, and conversational AI to provide intelligent answers based on your document content. Whether you're analyzing research papers, legal documents, or technical manuals, DocAgent makes information retrieval intuitive and conversational.

### Problem It Solves

- **Privacy Concerns**: No need to upload sensitive documents to third-party servers
- **Information Overload**: Quickly find specific information in lengthy documents
- **Accessibility**: Ask questions in natural language instead of manual searching
- **Offline Capability**: Works completely offline once loaded

---

## ✨ Key Features

- 🔒 **100% Local Processing** - All document processing and AI inference happens in your browser
- 📄 **PDF Support** - Upload and chat with PDF documents of any size
- 💬 **Conversational Interface** - Ask questions in natural language and get contextual answers
- 🎨 **Modern UI** - Beautiful, responsive interface with dark/light theme support
- 🔍 **Smart Search** - Vector-based semantic search for accurate information retrieval
- 💾 **Persistent Storage** - Documents and chat history stored locally using IndexedDB
- ⚡ **Real-time Processing** - Fast document chunking and embedding generation
- 🌓 **Theme Toggle** - Custom dark and light themes with smooth transitions
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

---

## 📸 Screenshots

### Light Theme
![DocAgent Light Theme](https://via.placeholder.com/800x450?text=DocAgent+Light+Theme)

### Dark Theme
![DocAgent Dark Theme](https://via.placeholder.com/800x450?text=DocAgent+Dark+Theme)

> **Note**: Replace placeholder images with actual screenshots of your application

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - Modern UI library with hooks
- **TypeScript 5.8** - Type-safe JavaScript
- **Vite 5.4** - Lightning-fast build tool
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components

### State Management & Data
- **TanStack Query** - Powerful async state management
- **Dexie.js** - IndexedDB wrapper for local storage
- **React Hook Form** - Performant form handling
- **Zod** - TypeScript-first schema validation

### PDF & AI Processing
- **PDF.js** - Mozilla's PDF rendering library
- **Supabase** - Backend-as-a-Service (optional for cloud features)

### UI Components & Icons
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide React** - Beautiful icon library
- **Sonner** - Toast notifications
- **React Markdown** - Markdown rendering

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS** - CSS transformations
- **Autoprefixer** - CSS vendor prefixing

---

## 📋 Prerequisites

Before running DocAgent locally, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher) or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Modern Web Browser** - Chrome, Firefox, Edge, or Safari (latest version)

### Optional
- **Supabase Account** - Only if you want to use cloud features (not required for local-only usage)

---

## 🚀 Installation

Follow these steps to get DocAgent running on your local machine:

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd docAgent
```

### 2. Install Dependencies

```bash
npm install
```

Or if you prefer yarn:

```bash
yarn install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration (see [Configuration](#configuration) section).

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080` (or another port if 8080 is in use).

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration (Optional - for cloud features)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

### Configuration Details

- **VITE_SUPABASE_URL**: Your Supabase project URL (optional, only needed for cloud sync)
- **VITE_SUPABASE_PUBLISHABLE_KEY**: Supabase anonymous key (optional)
- **VITE_SUPABASE_PROJECT_ID**: Your Supabase project ID (optional)

> **Note**: The application works fully offline without Supabase configuration. These variables are only needed if you want to enable cloud synchronization features.

### Theme Customization

The application supports custom color themes. You can modify the color palettes in `src/index.css`:

- **Dark Theme**: `#11224E`, `#F87B1B`, `#CBD99B`, `#EEEEEE`
- **Light Theme**: `#F5AFAF`, `#F9DFDF`, `#FBEFEF`, `#FCF8F8`

---

## 💡 Usage

### Uploading Documents

1. Click the **Upload Zone** in the sidebar
2. Select a PDF file from your device
3. Wait for the document to be processed (chunking and embedding generation)
4. The document will appear in your documents list

### Chatting with Documents

1. Select a document from the sidebar
2. Type your question in the chat input
3. Press Enter or click Send
4. The AI will analyze the document and provide a contextual answer

### Managing Documents

- **Select Document**: Click on any document in the sidebar to start chatting
- **Delete Document**: Click the delete icon on a document card
- **View Document Info**: See upload date and file size on each document card

### Theme Switching

- **Mobile**: Click the sun/moon icon in the top-right header
- **Desktop**: Click the theme toggle button in the sidebar footer

---

## 📁 Project Structure

```
docAgent/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # shadcn/ui components
│   │   ├── ChatInterface.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── ...
│   ├── hooks/          # Custom React hooks
│   │   ├── useTheme.ts
│   │   ├── useDocumentChat.ts
│   │   └── usePdfProcessor.ts
│   ├── pages/          # Page components
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── lib/            # Utility functions
│   ├── integrations/   # Third-party integrations
│   ├── db.ts           # Dexie database configuration
│   ├── index.css       # Global styles and theme variables
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Application entry point
├── .env                # Environment variables (create from .env.example)
├── package.json        # Dependencies and scripts
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── README.md           # This file
```

---

## 🔧 Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Build for development (with source maps)
npm run build:dev

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Code Style

This project uses:
- **ESLint** for code linting
- **TypeScript** for type safety
- **Prettier** (recommended) for code formatting

### Adding New Components

1. Create component in `src/components/`
2. Use TypeScript for type safety
3. Follow the existing component patterns
4. Import and use shadcn/ui components when possible

### Database Schema

The application uses Dexie.js with IndexedDB. Schema is defined in `src/db.ts`:

- **files**: Stores uploaded PDF metadata
- **chunks**: Stores document chunks with embeddings
- **messages**: Stores chat history

---

## 🧪 Testing

Currently, the project does not have automated tests configured. To test manually:

1. Start the development server: `npm run dev`
2. Upload a sample PDF document
3. Ask questions about the document content
4. Verify responses are contextually accurate
5. Test theme switching
6. Test document deletion and management

### Future Testing Plans

- Unit tests with Vitest
- Component tests with React Testing Library
- E2E tests with Playwright

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deployment Options

#### Option 1: Lovable (Recommended)

1. Visit [Lovable](https://lovable.dev/projects/f75686aa-22ee-49f7-9216-02760c026b2e)
2. Click **Share → Publish**
3. Your app will be deployed automatically

#### Option 2: Vercel

```bash
npm install -g vercel
vercel
```

#### Option 3: Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Option 4: Static Hosting

Upload the contents of the `dist/` folder to any static hosting service:
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting
- Cloudflare Pages

### Custom Domain

To connect a custom domain via Lovable:
1. Navigate to **Project → Settings → Domains**
2. Click **Connect Domain**
3. Follow the instructions

[Learn more about custom domains](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

## 🤝 Contributing

Contributions are welcome! This is currently a solo project, but community input is appreciated.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Update documentation as needed
- Test your changes thoroughly
- Keep PRs focused on a single feature/fix

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

**Project Maintainer**: Karthikeyan

- **GitHub**: [Open an issue](https://github.com/yourusername/docAgent/issues)
- **Email**: your.email@example.com

### Support

If you encounter any issues or have questions:
1. Check existing [GitHub Issues](https://github.com/yourusername/docAgent/issues)
2. Open a new issue with detailed information
3. Include error messages, screenshots, and steps to reproduce

---

## 🙏 Acknowledgements

This project was built with the help of amazing open-source tools and libraries:

- **[Lovable](https://lovable.dev/)** - For the initial project scaffolding and deployment platform
- **[shadcn/ui](https://ui.shadcn.com/)** - For beautiful, accessible UI components
- **[Radix UI](https://www.radix-ui.com/)** - For unstyled, accessible component primitives
- **[Lucide](https://lucide.dev/)** - For the comprehensive icon library
- **[PDF.js](https://mozilla.github.io/pdf.js/)** - For PDF rendering capabilities
- **[Dexie.js](https://dexie.org/)** - For the elegant IndexedDB wrapper
- **[Tailwind CSS](https://tailwindcss.com/)** - For the utility-first CSS framework

Special thanks to the open-source community for making projects like this possible!

---

## 🗺️ Roadmap

### Planned Features

- [ ] **Multi-document Chat** - Chat across multiple documents simultaneously
- [ ] **Advanced Search** - Full-text search with filters and sorting
- [ ] **Export Conversations** - Export chat history as PDF or Markdown
- [ ] **Document Annotations** - Highlight and annotate important sections
- [ ] **Mobile App** - Native iOS and Android applications
- [ ] **Cloud Sync** - Optional cloud synchronization across devices
- [ ] **OCR Support** - Extract text from scanned PDFs
- [ ] **More File Formats** - Support for DOCX, TXT, and other formats
- [ ] **AI Model Selection** - Choose from different AI models
- [ ] **Collaborative Features** - Share documents and conversations with team members

### Version History

- **v0.0.0** (Current) - Initial release with core features

---

<div align="center">

**Made with ❤️ using React, TypeScript, and AI**

[⬆ Back to Top](#docagent---local-ai-document-chat)

</div>
