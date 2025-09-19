# AICN - AI Classroom Notifier (Deployment Ready)

## Overview
This is the deployment-ready version of the AICN (AI Classroom Notifier) application. This document provides instructions for deploying the application in a production environment.

## Directory Structure
```
deployment-ready/
├── app/                    # Main application code
│   ├── public/            # Static assets (HTML, CSS, JS, images)
│   │   ├── admin-features/
│   │   ├── user-features/
│   │   ├── assets/        # Images, icons, fonts
│   │   ├── index.html
│   │   ├── user.html
│   │   ├── style.css
│   │   ├── admin.css
│   │   ├── manifest.json
│   │   └── favicon.ico
│   ├── server/            # Server-side code
│   │   ├── config/
│   │   ├── services/
│   │   ├── scripts/
│   │   └── server.js
│   ├── templates/         # CSV templates for data import
│   └── import/            # Sample data for initial import
├── config/                # Configuration files
│   ├── .env.production    # Production environment variables
│   └── .env.example       # Example environment file
├── scripts/               # Deployment and maintenance scripts
│   ├── start.sh           # Application start script (Linux/Mac)
│   └── start.bat          # Application start script (Windows)
├── package.json
├── package-lock.json
└── README.md              # This file
```

## Prerequisites
- Node.js (version 14 or higher)
- MySQL (version 5.7 or higher)
- npm (usually comes with Node.js)

## Installation

1. **Clone or copy this directory** to your deployment server

2. **Install dependencies**:
   ```bash
   npm install --production
   ```

3. **Configure the database**:
   - Create a MySQL database for the application
   - Update the database configuration in `config/.env.production`
   - Run the database initialization scripts:
     ```bash
     node app/server/scripts/init-db.js
     ```

4. **Start the application**:
   - On Linux/Mac:
     ```bash
     ./scripts/start.sh
     ```
   - On Windows:
     ```cmd
     scripts\start.bat
     ```

## Configuration

### Environment Variables
Copy `config/.env.example` to `config/.env.production` and update the values:
- `DB_HOST`: Database host (default: localhost)
- `DB_PORT`: Database port (default: 3306)
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `PORT`: Application port (default: 3000)

## Database Setup

1. Create the database:
   ```sql
   CREATE DATABASE aicn_app_db;
   ```

2. Create the database user:
   ```sql
   CREATE USER 'aicn_user'@'localhost' IDENTIFIED BY 'SecurePass123!';
   GRANT ALL PRIVILEGES ON aicn_app_db.* TO 'aicn_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. Initialize the database tables:
   ```bash
   node app/server/scripts/init-db.js
   ```

## Deployment Options

### Option 1: Direct Deployment
Run the application directly on a server using the start scripts.

### Option 2: Docker Deployment
Create a Dockerfile based on the application structure (not included in this package).

### Option 3: Cloud Deployment
Deploy to cloud platforms like AWS, Azure, or Google Cloud using their deployment tools.

## Security Considerations

1. **Environment Variables**: Never commit `.env.production` to version control
2. **File Permissions**: Ensure proper file permissions on the server
3. **Reverse Proxy**: Use a reverse proxy (like Nginx) in production
4. **SSL/TLS**: Enable HTTPS for secure communication
5. **Regular Updates**: Keep Node.js and dependencies updated

## Maintenance

1. **Database Backups**: Regular database backups
2. **Log Monitoring**: Monitor application logs for errors
3. **Dependency Updates**: Regular updates of dependencies
4. **Performance Monitoring**: Monitor application performance

## Troubleshooting

### Common Issues

1. **Database Connection Failed**:
   - Check database credentials in `.env.production`
   - Verify MySQL server is running
   - Check firewall settings

2. **Port Already in Use**:
   - Change the PORT in `.env.production`
   - Check for other applications using the same port

3. **Missing Dependencies**:
   - Run `npm install --production` again

### Logs
Check the console output for error messages. For production environments, consider setting up proper logging.

## Support
For issues with deployment, please refer to the main project documentation or contact the development team.