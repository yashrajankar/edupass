# EduPass - Exam Seating Arrangement System

EduPass is a comprehensive exam seating arrangement system designed to streamline the process of organizing and managing seating plans for educational institutions.

## Features

- **Student Management**: Import and manage student data with roll numbers, names, sections, and contact information
- **Staff Management**: Maintain staff records with designation and contact details
- **Room Management**: Define examination rooms with capacity and layout configurations
- **Timetable Management**: Create and manage exam schedules with subjects, dates, and time slots
- **Seating Arrangement**: Automatically generate seating plans with advanced algorithms to ensure fair distribution
- **Dashboard**: Real-time overview of system status, student distribution, and upcoming exams
- **Reports**: Generate detailed reports and export data in various formats

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yashrajankar/edupass.git
   ```

2. Install dependencies:
   ```bash
   cd edupass
   npm install
   ```

3. Set up the database:
   - Create a MySQL database
   - Update the database configuration in `config/db.js`
   - Run the initialization scripts in the `scripts/` directory

4. Start the application:
   ```bash
   npm start
   ```

## Deployment

### Deploying to Vercel

This project can be deployed to Vercel as a static website:

1. Push your code to a GitHub repository
2. Sign in to your Vercel account
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: (Leave empty for static site)
   - Output Directory: ./
6. Click "Deploy"

The application will be available at your Vercel URL. The root index.html file serves as the login page for both admin and user portals.

### Local Development

For local development, you can run the application using:

```bash
npm start
```

This will start the server on `http://localhost:3000`

## Usage

1. Access the login page at the root URL
2. Use the toggle button to switch between Admin and User login
3. For Admin:
   - Username: admin
   - Password: admin123
   - After login, you'll be redirected to the admin dashboard
4. For User:
   - Enter your Roll No. and Password
   - After login, you'll be redirected to the user dashboard

## Project Structure

- `index.html` - Main login page
- `admin-features/` - Admin portal pages and functionality
- `user-features/` - User portal pages and functionality
- `deployment-ready/` - Complete application package ready for deployment

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For support or inquiries, please contact the project maintainers.