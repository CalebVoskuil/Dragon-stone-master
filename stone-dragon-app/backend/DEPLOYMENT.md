# Backend Deployment Guide

The backend is a Node.js/Express API server that must be deployed separately from the mobile app.

---

## Deployment Options

### Option 1: AWS EC2 (Recommended for AWS RDS)

Since you're already using AWS RDS and S3, EC2 is a natural fit.

#### Steps:

1. **Launch EC2 Instance**
   - Choose **Amazon Linux 2023** (you selected version 6.1)
   - Select instance type (t3.micro for testing, t3.small+ for production)
   - Configure security group:
     - **Inbound Rule**: TCP port 3001 from your IP or 0.0.0.0/0 (add HTTPS/443 for production)
   - Create/select key pair for SSH access

2. **Connect to EC2**
   
   **Where to run:** From your local computer's terminal/command prompt (PowerShell on Windows, Terminal on Mac/Linux)
   
   **Which IP to use:**
   - Use the **PUBLIC IPv4 address** (for connecting from your local computer)
   - Private IP only works from within the AWS VPC
   
   **Find your EC2 IP:**
   - In AWS Console → EC2 → Instances
   - Look for "Public IPv4 address" (or "IPv4 Public IP")
   - Example: `54.123.45.67`
   
   **SSH Command:**
   ```bash
   # Make sure your key file has correct permissions (Linux/Mac)
   chmod 400 MyKeyPair.pem
   
   # Connect to EC2 (use PUBLIC IP)
   ssh -i MyKeyPair.pem ec2-user@YOUR_PUBLIC_IP
   ```
   
   **Windows PowerShell Example:**
   ```powershell
   # Example if your key is in Downloads folder
   ssh -i "C:\Users\caleb\Downloads\MyKeyPair.pem" ec2-user@54.123.45.67
   
   # Or navigate to the folder first
   cd C:\Users\caleb\Downloads
   ssh -i MyKeyPair.pem ec2-user@54.123.45.67
   ```
   
   **Windows PuTTY Alternative:**
   - If SSH command doesn't work, use PuTTY:
   - Convert `.pem` to `.ppk` using PuTTYgen
   - In PuTTY: Connection → SSH → Auth → Browse for your `.ppk` file
   - Host: `ec2-user@YOUR_PUBLIC_IP`
   - Port: `22`
   
   **First time connection:**
   - You'll see a message about host authenticity - type `yes`
   - You should then be logged into your EC2 instance

3. **Install Dependencies (Amazon Linux 2023)**
   ```bash
   # Update system
   sudo dnf update -y
   
   # Install Node.js 20 using NodeSource repository
   curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
   sudo dnf install -y nodejs
   
   # Verify Node.js installation
   node --version  # Should show v20.x.x
   npm --version
   
   # Install PM2 (process manager)
   sudo npm install -g pm2
   
   # Install Git (if not already installed)
   sudo dnf install -y git
   ```

4. **Deploy Code**
   ```bash
   # Clone repository
   git clone https://github.com/CalebVoskuil/Dragon-stone-master.git
   cd Dragon-stone-master/stone-dragon-app/backend
   
   # Install dependencies
   npm install
   
   # Copy environment file
   cp env.example .env
   # Edit .env with production values (see below)
   
   # Generate Prisma client
   npm run db:generate
   
   # Run migrations
   npm run db:deploy
   
   # Build TypeScript
   npm run build
   ```

5. **Configure Environment Variables** (`.env` file)
   ```env
   # Database (your RDS endpoint)
   DATABASE_URL="postgresql://postgres:password@your-rds-endpoint:5432/stone-dragon?schema=public"
   
   # Session
   SESSION_SECRET="generate-a-random-secret-here"
   
   # Server
   PORT=3001
   NODE_ENV="production"
   
   # AWS S3 (your bucket)
   AWS_REGION="af-south-1"
   S3_BUCKET_PROOFS="stone-dragon-bucket"
   S3_SIGNED_URL_TTL=900
   AWS_ACCESS_KEY_ID="your-access-key"
   AWS_SECRET_ACCESS_KEY="your-secret-key"
   
   # CORS - Update with your domain
   CORS_ORIGIN="*"  # Or specific domain: "https://yourdomain.com"
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

6. **Start with PM2**
   ```bash
   # Start the server
   pm2 start dist/server.js --name stone-dragon-api
   
   # Save PM2 configuration
   pm2 save
   
   # Setup PM2 to start on boot
   pm2 startup
   ```

7. **Setup Nginx (Optional - Recommended)**
   For HTTPS and better routing:
   ```bash
   # Install Nginx on Amazon Linux
   sudo dnf install -y nginx
   
   # Start and enable Nginx
   sudo systemctl start nginx
   sudo systemctl enable nginx
   
   # Edit Nginx configuration
   sudo nano /etc/nginx/nginx.conf
   ```
   
   Add this configuration inside the `http` block in `/etc/nginx/nginx.conf`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3001;
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
   
   Alternatively, create a separate config file:
   ```bash
   sudo nano /etc/nginx/conf.d/stone-dragon.conf
   # Paste the server block above
   ```
   
   Then:
   ```bash
   # Test Nginx configuration
   sudo nginx -t
   
   # Restart Nginx
   sudo systemctl restart nginx
   ```

8. **Setup SSL (Let's Encrypt) - Optional**
   ```bash
   # Install certbot on Amazon Linux
   sudo dnf install -y certbot python3-certbot-nginx
   
   # Get SSL certificate
   sudo certbot --nginx -d your-domain.com
   
   # Certbot will automatically configure Nginx for HTTPS
   # Certificates auto-renew via systemd timer (already enabled)
   ```

---

### Option 2: Railway (Easiest - Good for Testing)

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL database (or use your RDS)
4. Deploy from GitHub repository
5. Set environment variables in Railway dashboard
6. Railway automatically builds and deploys

---

### Option 3: Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create stone-dragon-api`
4. Add PostgreSQL: `heroku addons:create heroku-postgresql:hobby-dev`
5. Set environment variables: `heroku config:set KEY=value`
6. Deploy: `git push heroku main`

---

## Environment Variables Reference

All required variables from `env.example`:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `SESSION_SECRET` | Secret for session encryption | Random string (use `openssl rand -base64 32`) |
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `production` |
| `AWS_REGION` | AWS region | `af-south-1` |
| `S3_BUCKET_PROOFS` | S3 bucket name | `stone-dragon-bucket` |
| `S3_SIGNED_URL_TTL` | Signed URL expiration (seconds) | `900` |
| `AWS_ACCESS_KEY_ID` | AWS access key | Your AWS key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | Your AWS secret |
| `CORS_ORIGIN` | Allowed CORS origins | `*` or specific domain |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

---

## Amazon Linux Quick Reference

**Key Differences from Ubuntu:**
- Username: `ec2-user` (not `ubuntu`)
- Package manager: `dnf` (replaces `yum`, similar to `apt`)
- Config files: Often in `/etc/nginx/nginx.conf` instead of `/etc/nginx/sites-available/`
- Service management: `systemctl` (same as Ubuntu)

**Useful Commands:**
```bash
# Update packages
sudo dnf update -y

# Install packages
sudo dnf install -y package-name

# Check service status
sudo systemctl status nginx
sudo systemctl status pm2-ec2-user

# View logs
sudo journalctl -u nginx -f
pm2 logs stone-dragon-api

# Check if port is in use
sudo netstat -tlnp | grep :3001
```

**AWS IAM Roles (Better than Access Keys)**
Instead of hardcoding AWS credentials, attach an IAM role to your EC2 instance:
1. Create IAM role with S3 and RDS permissions
2. Attach role to EC2 instance (Actions → Security → Modify IAM role)
3. Remove `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` from `.env`
4. AWS SDK will automatically use the instance role

---

## Post-Deployment Checklist

- [ ] Backend server is running and accessible
- [ ] Database migrations are applied (`npm run db:deploy`)
- [ ] Environment variables are set correctly
- [ ] CORS is configured to allow your mobile app
- [ ] HTTPS is enabled (for production)
- [ ] Server logs are accessible (PM2: `pm2 logs`)
- [ ] Database is seeded with initial data (`npm run db:seed`)
- [ ] API is responding at `/api/health` (if you have a health endpoint)
- [ ] S3 bucket is configured and accessible
- [ ] RDS security group allows connections from EC2
- [ ] EC2 security group allows inbound traffic on port 3001 (or 443 if using HTTPS)

---

## Updating the Frontend API URL

After deploying the backend, update the frontend:

1. Get your backend URL:
   - EC2: `http://your-ec2-ip:3001/api` or `https://your-domain.com/api`
   - Railway: `https://your-app.railway.app/api`
   - Heroku: `https://your-app.herokuapp.com/api`

2. Update `frontend/src/services/api.ts`:
   ```typescript
   baseURL: 'https://your-backend-url.com/api',
   ```

3. Rebuild your APK with the new URL

---

## Monitoring & Maintenance

### View Logs (PM2)
```bash
pm2 logs stone-dragon-api
pm2 monit  # Real-time monitoring
```

### Restart Server
```bash
pm2 restart stone-dragon-api
```

### Update Code
```bash
git pull
npm install
npm run build
pm2 restart stone-dragon-api
```

### Database Migrations
```bash
npm run db:deploy
```

---

## Troubleshooting

### Can't connect to database
- Check RDS security group allows EC2 IP
- Verify `DATABASE_URL` is correct
- Ensure database is publicly accessible (or use VPN/bastion)

### S3 upload fails
- Verify AWS credentials are correct
- Check IAM permissions for S3 bucket
- Verify bucket name and region match

### CORS errors
- Update `CORS_ORIGIN` in `.env`
- Restart server after changing env vars

### Server won't start
- Check logs: `pm2 logs stone-dragon-api`
- Verify all environment variables are set
- Check port 3001 is not in use: `lsof -i :3001`

