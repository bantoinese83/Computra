# Computra

**AI Compute Decision Engine & Marketplace**

Computra is an intelligent platform that helps users find the optimal GPU compute resources for their AI workloads. Think Skyscanner for AI compute—answer a few questions, get personalized recommendations, and compare real-time pricing from verified providers.

## ✨ Features

- **Smart Questionnaire**: Multi-step questionnaire that captures workload requirements (training, inference, model size, budget, latency, region, commitment)
- **AI-Powered Recommendations**: Uses Google Gemini with real-time web search to recommend optimal GPU tiers and specific models
- **Live Market Data**: Fetches current pricing and specifications from multiple cloud providers
- **Comparison Tool**: Side-by-side comparison of up to 4 offers with detailed specifications
- **AI Assistant**: Interactive AI assistant to answer questions about recommendations
- **Shareable Links**: Generate shareable URLs with your configuration
- **Modern UI**: Clean, responsive design with smooth animations and keyboard navigation

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS (PostCSS)
- **Routing**: React Router v7
- **AI/ML**: Google Gemini API with Google Search Grounding
- **Icons**: Lucide React
- **Code Quality**: ESLint, Prettier, TypeScript Strict Mode, Knip

## 📁 Project Structure

```
computra/
├── src/
│   ├── components/          # React components
│   │   ├── Questionnaire.tsx    # Multi-step questionnaire
│   │   ├── Results.tsx          # Results page with offers table
│   │   ├── CompareModal.tsx     # Comparison modal
│   │   ├── GeminiAssistant.tsx  # AI chat assistant
│   │   └── StepIndicator.tsx    # Progress indicator
│   ├── hooks/               # Custom React hooks
│   │   └── useGpuRecommendations.ts  # GPU recommendation logic
│   ├── utils/               # Utility functions
│   │   ├── engine.ts            # Prompt generation
│   │   └── logger.ts            # Structured logging
│   ├── types.ts             # TypeScript type definitions
│   ├── constants.ts         # Constants and configuration
│   ├── App.tsx              # Main app component
│   ├── index.tsx            # Entry point
│   └── index.css            # Global styles (Tailwind)
├── public/                  # Static assets
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── eslint.config.mjs       # ESLint configuration
├── .prettierrc             # Prettier configuration
└── knip.json               # Knip configuration
```

## ⚠️ SECURITY WARNING

**IMPORTANT**: The current implementation exposes your API key in the client-side JavaScript bundle. This is a **critical security risk** for production use.

**Before deploying to production:**
1. Read [`SECURITY.md`](./SECURITY.md) for complete security guidelines
2. Implement a backend proxy (see [`api/README.md`](./api/README.md))
3. Never commit `.env` files to git
4. Rotate your API key if it's been exposed

**For development**: The current setup works but is insecure. Use a backend proxy for any public deployment.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **npm** or **yarn**
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bantoinese83/Computra.git
   cd computra
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your actual API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```
   
   ⚠️ **Never commit `.env` to git!** It's already in `.gitignore`.

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run knip` - Find unused code and dependencies

## 🏗️ Build & Deployment

### Production Build

```bash
npm run build
```

The production build will be output to the `dist/` directory, optimized and ready for deployment.

### Deployment

The app can be deployed to any static hosting service:
- **Vercel**: `vercel deploy`
- **Netlify**: Connect your Git repository
- **Cloudflare Pages**: Connect your Git repository
- **AWS S3 + CloudFront**: Upload `dist/` folder

⚠️ **SECURITY**: Before deploying, implement a backend proxy to keep your API key secure. See [`SECURITY.md`](./SECURITY.md) and [`api/README.md`](./api/README.md) for details.

If deploying without a backend proxy (NOT RECOMMENDED for production), set the `GEMINI_API_KEY` environment variable in your hosting platform's environment settings. **Note**: This will still expose your key in the client bundle.

## 🏛️ Architecture

### Separation of Concerns

- **Data Access**: `useGpuRecommendations` hook handles all API calls and data fetching
- **Business Logic**: Domain logic in hooks and utility functions
- **UI Components**: Pure presentation components with minimal logic
- **Type Safety**: Comprehensive TypeScript types for all data structures

### Key Design Decisions

- **URL-based State**: Questionnaire state stored in URL query parameters for shareability
- **Structured Logging**: All errors logged with context using custom logger utility
- **Strict TypeScript**: Full type safety with strict mode enabled
- **Modular Hooks**: Reusable hooks for data fetching and state management
- **Accessibility**: ARIA labels, keyboard navigation, focus management

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |

### Tailwind CSS

Tailwind is configured via `tailwind.config.js`. The content paths are set to scan all files in `src/` and `index.html`.

### TypeScript

TypeScript is configured with strict mode enabled. See `tsconfig.json` for full configuration.

## 🧪 Code Quality

This project maintains high code quality standards:

- **TypeScript Strict Mode**: All type checking enabled
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Consistent code formatting
- **Knip**: Unused code detection

Run all quality checks:
```bash
npm run lint && npm run format && npm run knip
```

## 📝 Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow React best practices (hooks, functional components)
- Use custom hooks for reusable logic
- Keep components small and focused
- Use structured logging instead of `console.log`

### Adding New Features

1. Create types in `src/types.ts`
2. Add constants to `src/constants.ts` if needed
3. Create hooks in `src/hooks/` for data logic
4. Create components in `src/components/`
5. Update routes in `src/App.tsx` if needed

## 🐛 Troubleshooting

### Build Errors

- **Tailwind classes not working**: Ensure `src/index.css` is imported in `src/index.tsx`
- **Type errors**: Run `npm run lint` to see detailed TypeScript errors
- **API errors**: Check that `GEMINI_API_KEY` is set correctly in `.env`

### Common Issues

- **Port already in use**: Change port in `vite.config.ts` or kill the process using port 3000
- **Module not found**: Run `npm install` to ensure all dependencies are installed

## 📄 License

Private project - All rights reserved

## 🤝 Contributing

This is a private project. For questions or issues, please contact the project maintainer.

---

**Built with ❤️ using React, TypeScript, and Google Gemini**
