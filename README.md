# Journal Jumble - Your Personal Journaling App

Journal Jumble is a modern, feature-rich journaling application built with Next.js and TypeScript. It provides a beautiful and intuitive interface for managing your daily thoughts, moods, and experiences.

## Features

- 📝 Create, edit, and delete journal entries
- 🎨 Rich text editing with formatting options
- 🏷️ Tag and mood tracking
- 🔍 Advanced search functionality
- 📊 Dashboard view with mood insights
- 📅 Calendar view for date-based navigation
- 📱 Responsive design for all devices
- 🔒 Local storage for data persistence
- 🎯 Multiple view modes (List, Dashboard, Calendar)
- 🔄 Real-time search suggestions
- 📈 Analytics and insights

## Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/dragonWarrior717/abner_test_task_journal.git
cd abner_test_task_journal-jumble-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Dependencies

- **Next.js** - React framework for production
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible components
- **Lucide Icons** - Beautiful & consistent icons
- **date-fns** - Modern JavaScript date utility library

## Project Structure

```
src/
├── app/                 # Main application pages
├── components/          # Reusable UI components
│   ├── journal/        # Journal-specific components
│   ├── layout/         # Layout components
│   ├── search/         # Search-related components
│   └── ui/             # UI components
├── lib/                # Utility functions
└── types/              # TypeScript type definitions
```

## Usage

### Creating a New Entry
1. Click the "New Entry" button in the sidebar
2. Fill in the title, content, mood, and tags
3. Click "Save" to create the entry

### Searching Entries
1. Click the search icon in the header
2. Type your search term
3. Use filters (date range, mood, tags) to refine results
4. Click on a suggestion or press Enter to search

### Viewing Entries
- **List View**: Chronological list of all entries
- **Dashboard View**: Visual overview with mood insights
- **Calendar View**: Date-based navigation
- **Detail View**: Full entry view with editing options

### Managing Entries
- Edit entries by clicking the edit button
- Delete entries using the delete button
- Filter entries by mood or tags
- Sort entries by date, title, or mood

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
