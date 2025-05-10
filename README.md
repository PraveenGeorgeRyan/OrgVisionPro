# OrgVision Pro

A professional web application for managing and visualizing company organizational hierarchies with an intuitive flowchart-style visualization. OrgVision Pro allows you to add, edit, and organize employees in a tree structure based on their reporting relationships, with the ability to export the organization chart as a PDF.

## Features

- Professional flowchart-style organization chart visualization
- Horizontal employee cards with profile images and details
- PDF export functionality with proper formatting
- Customizable organization name with persistence
- Complete employee management (add, edit, delete)
- Reporting hierarchy visualization with connecting lines
- Image upload functionality for employee profiles
- Responsive design for all devices

## Technology Stack

### Frontend
- Next.js (React) for the UI framework
- TypeScript for type safety
- Redux Toolkit for state management
- React Hook Form for form handling and validation
- TailwindCSS for styling
- react-organizational-chart for professional tree visualization
- html2canvas and jsPDF for PDF export functionality

### Backend
- Node.js + Express for the server
- TypeScript for type safety
- RESTful API architecture
- SQL database for data storage
- Proper error handling and validation

## Project Structure

```
organization_tree/
├── src/                     # Frontend application code
│   ├── components/          # Reusable UI components
│   │   ├── employees/       # Employee-related components
│   │   ├── organization/    # Organization tree components
│   │   └── ui/              # Shared UI components
│   ├── redux/               # Redux state management
│   │   ├── slices/          # Redux toolkit slices
│   │   └── store.ts         # Redux store configuration
│   └── utils/               # Utility functions (PDF export, etc.)
├── backend/                 # Backend server code
│   ├── controllers/         # API endpoint controllers
│   ├── data/                # JSON data store
│   ├── models/              # TypeScript data models
│   ├── routes/              # API route definitions
│   └── uploads/             # Employee image storage
├── shared/                  # Shared types between frontend and backend
├── public/                  # Static assets
└── ...config files          # Configuration files (next.config.js, etc.)
```

This structure follows TypeScript best practices with proper separation of concerns, modular components, and clean architecture principles.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- SQL database (MySQL, PostgreSQL, etc.)

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd organization_tree
   ```

2. Install frontend dependencies
   ```bash
   npm install
   ```

3. Install backend dependencies
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. Configure environment variables
   - Create `.env.local` in the root with the following content:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:5000
     ```
   - The backend uses default configurations, no additional environment variables needed for development

5. Start the development servers

   Frontend and Backend (concurrently):
   ```bash
   # From the project root
   npm run dev          # Start Next.js frontend
   npm run backend:dev  # In another terminal, start the backend
   ```

   This will start:
   - Frontend at [http://localhost:3000](http://localhost:3000)
   - Backend at [http://localhost:5000](http://localhost:5000)

6. The application will be fully functional with sample data and images included

## Deployment

### Vercel Deployment (Frontend)

1. Push your repository to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard:
   - Add `NEXT_PUBLIC_API_URL` pointing to your production backend
4. Deploy with default Next.js settings

### Backend Deployment

1. Deploy the backend to a service like Heroku, Render, or Railway
2. Set up environment variables for your production environment
3. Configure CORS settings to allow requests from your Vercel domain

### Note for Reviewers

- Sample employee images are included in the repository for demonstration purposes
- In a production environment, user-uploaded files would typically be stored in a proper file storage service like AWS S3

## Usage Guide

1. **Viewing the Organization Tree**
   - The home page displays the current organization structure
   - Employees are displayed in a hierarchical tree based on reporting relationships

2. **Adding a New Employee**
   - Click the "Add Employee" button
   - Fill in the required employee details in the form
   - Select a reporting manager from the dropdown
   - Upload an employee image (optional)
   - Submit the form to add the employee to the organization

3. **Editing Employee Details**
   - Click on an employee card in the tree
   - Update the employee information in the form
   - Save changes to update the employee record

## API Documentation

The backend provides the following RESTful API endpoints:

- `GET /api/employees` - Retrieve all employees
- `GET /api/employees/:id` - Retrieve a specific employee
- `POST /api/employees` - Add a new employee
- `PUT /api/employees/:id` - Update an employee
- `DELETE /api/employees/:id` - Delete an employee
- `GET /api/organization` - Get the full organization structure

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add some amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
