# CollabTask Pro - Advanced Task Management Platform

A modern, feature-rich task management application built with Next.js, TypeScript, and Tailwind CSS. CollabTask Pro provides teams with powerful tools to organize, track, and collaborate on projects efficiently.

## ✨ Features

### 🔐 Authentication & Security
- **LocalStorage-based Authentication** - No external database required
- **Protected Routes** - Automatic redirect for unauthenticated users
- **Session Persistence** - Remember me functionality
- **User Registration** - Complete signup flow with validation

### 📊 Multiple View Modes
- **📋 Board View** - Kanban-style drag-and-drop interface
- **📝 List View** - Organized task lists grouped by status
- **📅 Calendar View** - Monthly calendar with due date visualization
- **📈 Table View** - Sortable data table with comprehensive task details
- **⏰ Timeline View** - Chronological activity timeline

### ✅ Task Management
- **Full CRUD Operations** - Create, read, update, delete tasks
- **Drag & Drop** - Move tasks between different status columns
- **Subtasks** - Break down complex tasks with progress tracking
- **Comments System** - Team collaboration with timestamped comments
- **Labels & Tags** - Organize tasks with custom labels
- **Priority Levels** - Low, Medium, High, Urgent priority system
- **Due Dates** - Track deadlines with overdue indicators
- **Task Types** - Bug, Feature, Improvement categorization

### 🏗️ Project Management
- **Project Creation** - Organize tasks into projects
- **Team Assignment** - Add team members to projects
- **Progress Tracking** - Visual progress bars and completion statistics
- **Project Analytics** - Detailed project insights and metrics

### 🔍 Advanced Search & Filtering
- **Live Search** - Real-time search across tasks and projects
- **Multi-Filter Support** - Filter by status, priority, assignee, type
- **Debounced Search** - Optimized search performance
- **Filter Persistence** - Remember applied filters

### 📈 Reports & Analytics
- **Interactive Charts** - Task distribution and progress visualization
- **Export Functionality** - PDF and CSV export capabilities
- **Custom Date Ranges** - Filter reports by specific time periods
- **Team Performance** - Individual and team productivity metrics

### ⚙️ Settings & Customization
- **Profile Management** - Update user information and avatar
- **Theme Switching** - Light/Dark mode with system preference
- **Notification Preferences** - Customize notification settings
- **Security Settings** - Password management and 2FA options

### 📱 Responsive Design
- **Mobile-First** - Optimized for all device sizes
- **Touch-Friendly** - Intuitive mobile interactions
- **Progressive Web App** - App-like experience on mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/collabtask-pro.git
   cd collabtask-pro
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Login
Since this uses localStorage-based authentication, you can log in with any email and password combination. The system will automatically create a demo user for you.

**Example credentials:**
- Email: \`demo@example.com\`
- Password: \`password123\`

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Lucide React** - Beautiful icon library

### State Management
- **React Hooks** - Built-in state management
- **LocalStorage** - Client-side data persistence
- **Custom Hooks** - Reusable state logic

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📁 Project Structure

\`\`\`
collabtask-pro/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Authentication pages
│   ├── projects/         # Project management
│   ├── reports/          # Analytics and reports
│   ├── settings/         # User settings
│   └── tasks/            # Task details
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── board-view.tsx    # Kanban board component
│   ├── task-card.tsx     # Task card component
│   └── ...
├── hooks/                # Custom React hooks
│   ├── use-auth.ts       # Authentication logic
│   ├── use-tasks.ts      # Task management
│   ├── use-projects.ts   # Project management
│   └── ...
├── lib/                  # Utility functions
└── public/               # Static assets
\`\`\`

## 🎯 Key Features Explained

### Authentication System
The app uses a localStorage-based authentication system that:
- Creates demo users automatically
- Persists login sessions
- Provides secure route protection
- Supports "Remember Me" functionality

### Task Management
Tasks support comprehensive metadata including:
- **Status tracking** (Backlog → To Do → In Progress → Done)
- **Priority levels** with visual indicators
- **Due dates** with overdue warnings
- **Assignee management** with avatar display
- **Subtask breakdown** with progress tracking
- **Comment threads** for collaboration

### Data Persistence
All data is stored in localStorage, including:
- User accounts and profiles
- Tasks and subtasks
- Projects and team assignments
- User preferences and settings
- Theme and notification preferences

## 🔧 Customization

### Adding New Task Types
Edit the task type options in \`components/task-modal.tsx\`:

\`\`\`typescript
const taskTypes = [
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature" },
  { value: "improvement", label: "Improvement" },
  { value: "research", label: "Research" }, // Add new type
]
\`\`\`

### Customizing Themes
Modify the theme configuration in \`tailwind.config.ts\` and \`app/globals.css\`.

### Adding New Views
Create new view components in the \`components/\` directory and add them to the dashboard view switcher.

## 📱 Mobile Experience

CollabTask Pro is fully responsive and provides:
- **Hamburger navigation** on mobile devices
- **Touch-optimized interactions** for drag and drop
- **Swipe gestures** for mobile navigation
- **Responsive layouts** that adapt to screen size

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy with Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy with default settings

### Deploy to Netlify

1. **Build the project**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Deploy to Netlify**
   - Drag and drop the \`out\` folder to Netlify
   - Or connect your GitHub repository

### Environment Variables
No environment variables are required as the app uses localStorage for all data persistence.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   \`\`\`bash
   git checkout -b feature/amazing-feature
   \`\`\`
3. **Commit your changes**
   \`\`\`bash
   git commit -m 'Add amazing feature'
   \`\`\`
4. **Push to the branch**
   \`\`\`bash
   git push origin feature/amazing-feature
   \`\`\`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use existing UI components from shadcn/ui
- Maintain responsive design principles
- Add proper error handling
- Include loading states for async operations

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** - For the beautiful UI components
- **Lucide** - For the comprehensive icon library
- **Tailwind CSS** - For the utility-first CSS framework
- **Next.js** - For the powerful React framework
- **Vercel** - For the seamless deployment platform

## 📞 Support

If you encounter any issues or have questions:

1. **Check the Issues** - Look for existing solutions
2. **Create an Issue** - Report bugs or request features
3. **Discussions** - Join community discussions

## 🗺️ Roadmap

### Upcoming Features
- [ ] **Real-time Collaboration** - WebSocket integration
- [ ] **File Attachments** - Upload and manage files
- [ ] **Advanced Notifications** - Email and push notifications
- [ ] **Time Tracking** - Built-in time tracking functionality
- [ ] **API Integration** - Connect with external services
- [ ] **Mobile App** - React Native mobile application
- [ ] **Advanced Analytics** - More detailed reporting
- [ ] **Team Management** - Advanced team and permission management

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

⭐ **Star this repository if you find it helpful!**
\`\`\`

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/collabtask-pro)
![GitHub forks](https://img.shields.io/github/forks/yourusername/collabtask-pro)
![GitHub issues](https://img.shields.io/github/issues/yourusername/collabtask-pro)
![GitHub license](https://img.shields.io/github/license/yourusername/collabtask-pro)
