# AICN Deployment Guide

## Overview
This guide provides detailed instructions for deploying the AICN (AI Classroom Notifier) application in a production environment.

## System Requirements

### Server Requirements
- Operating System: Linux (Ubuntu 18.04+), Windows Server 2016+, or macOS 10.14+
- RAM: Minimum 2GB, Recommended 4GB+
- Storage: Minimum 10GB free space
- CPU: Minimum 2 cores, Recommended 4 cores

### Software Requirements
- Node.js v14.x or higher
- MySQL v5.7 or higher
- npm v6.x or higher
- Git (for cloning the repository)

## Installation Steps

### 1. Prepare the Server

#### Ubuntu/Debian:
```bash
# Update package list
sudo apt update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt install mysql-server

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql
```

#### CentOS/RHEL:
```bash
# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_14.x | sudo bash -
sudo yum install -y nodejs

# Install MySQL
sudo yum install mysql-server

# Start MySQL service
sudo systemctl start mysqld
sudo systemctl enable mysqld
```

#### Windows:
1. Download and install Node.js from https://nodejs.org/
2. Download and install MySQL from https://dev.mysql.com/downloads/mysql/

### 2. Database Setup

#### Create Database and User
```sql
-- Login to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE aicn_app_db;

-- Create user
CREATE USER 'aicn_user'@'localhost' IDENTIFIED BY 'SecurePass123!';

-- Grant privileges
GRANT ALL PRIVILEGES ON aicn_app_db.* TO 'aicn_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### 3. Application Deployment

#### Option A: Deploy from Deployment Package
1. Extract the deployment package to your desired location
2. Navigate to the deployment directory:
   ```bash
   cd /path/to/deployment-ready
   ```

#### Option B: Deploy from Source
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd aicn
   ```

2. Install dependencies:
   ```bash
   npm install --production
   ```

### 4. Configuration

1. Copy the example environment file:
   ```bash
   cp config/.env.example config/.env.production
   ```

2. Edit the configuration:
   ```bash
   nano config/.env.production
   ```
   
   Update the following values:
   - `DB_HOST`: Database host (usually localhost)
   - `DB_PORT`: Database port (default 3306)
   - `DB_USER`: Database username (aicn_user)
   - `DB_PASSWORD`: Database password (SecurePass123!)
   - `DB_NAME`: Database name (aicn_app_db)
   - `PORT`: Application port (default 3000)

### 5. Database Initialization

Run the database initialization script:
```bash
node app/server/scripts/init-db.js
```

This will create all necessary tables and initialize the database schema.

### 6. Start the Application

#### Linux/Mac:
```bash
./scripts/start.sh
```

#### Windows:
```cmd
scripts\start.bat
```

#### Manual Start:
```bash
node app/server/server.js
```

### 7. Verify Installation

1. Open a web browser and navigate to:
   ```
   http://localhost:3000
   ```

2. You should see the AICN login page

3. Test the API endpoints:
   ```
   http://localhost:3000/api/health
   ```

## Production Deployment

### Reverse Proxy Setup (Nginx)

1. Install Nginx:
   ```bash
   # Ubuntu/Debian
   sudo apt install nginx
   
   # CentOS/RHEL
   sudo yum install nginx
   ```

2. Create Nginx configuration:
   ```bash
   sudo nano /etc/nginx/sites-available/aicn
   ```

3. Add the following configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
   
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/aicn /etc/nginx/sites-enabled/
   ```

5. Test and restart Nginx:
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### SSL Certificate (Let's Encrypt)

1. Install Certbot:
   ```bash
   # Ubuntu/Debian
   sudo apt install certbot python3-certbot-nginx
   
   # CentOS/RHEL
   sudo yum install certbot python3-certbot-nginx
   ```

2. Obtain SSL certificate:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

### Process Management (PM2)

1. Install PM2 globally:
   ```bash
   npm install -g pm2
   ```

2. Start the application with PM2:
   ```bash
   pm2 start app/server/server.js --name "aicn"
   ```

3. Set PM2 to start on boot:
   ```bash
   pm2 startup
   pm2 save
   ```

## Backup and Recovery

### Database Backup
```bash
mysqldump -u aicn_user -p aicn_app_db > backup-$(date +%Y%m%d).sql
```

### Database Restore
```bash
mysql -u aicn_user -p aicn_app_db < backup-file.sql
```

## Monitoring and Maintenance

### Log Monitoring
Check application logs regularly:
```bash
# If using PM2
pm2 logs aicn

# If running directly
tail -f /var/log/aicn/app.log
```

### Regular Maintenance Tasks
1. Update dependencies: `npm update --production`
2. Database optimization: Run MySQL optimization scripts
3. Log rotation: Implement log rotation to prevent disk space issues
4. Security updates: Keep OS and software updated

## Troubleshooting

### Common Issues and Solutions

1. **Application fails to start**
   - Check if the port is already in use
   - Verify database connection settings
   - Check file permissions

2. **Database connection errors**
   - Verify MySQL is running: `sudo systemctl status mysql`
   - Check database credentials
   - Ensure the database user has proper privileges

3. **Performance issues**
   - Monitor system resources
   - Check database query performance
   - Consider adding indexes to frequently queried columns

4. **SSL/TLS issues**
   - Verify certificate validity
   - Check certificate paths in Nginx configuration
   - Ensure proper certificate chain

### Log Locations
- Application logs: Console output or PM2 logs
- Nginx logs: `/var/log/nginx/`
- MySQL logs: `/var/log/mysql/` or `/var/log/mysqld.log`

## Security Best Practices

1. **Firewall Configuration**
   - Allow only necessary ports (80, 443, 22)
   - Restrict database access to localhost only

2. **File Permissions**
   - Set proper ownership and permissions on application files
   - Restrict access to configuration files

3. **Regular Security Audits**
   - Update dependencies regularly
   - Monitor for security vulnerabilities
   - Review access logs for suspicious activity

4. **Data Encryption**
   - Use HTTPS for all communications
   - Consider encrypting sensitive data at rest

## Scaling Considerations

### Horizontal Scaling
- Use load balancers for multiple application instances
- Implement database replication for read-heavy workloads

### Vertical Scaling
- Increase server resources (CPU, RAM, storage)
- Optimize database queries and indexes

### Caching
- Implement Redis or Memcached for frequently accessed data
- Use browser caching for static assets

## Support
For deployment issues or questions, please contact the development team or refer to the main project documentation.