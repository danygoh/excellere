# Excellere — AI Learning Platform

An AI-Native Learning Platform for Business Leaders, built with Next.js.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![License](https://img.shields.io/badge/License-Private-red)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/excellere.git
cd excellere

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:4000

## 🛠️ Development

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Create `.env.local`:

```env
# Optional: Analytics
NEXT_PUBLIC_GA_ID=

# Optional: Database (for future use)
DATABASE_URL=
```

## ☁️ Deployment to AWS

### Option 1: AWS Amplify (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/excellere.git
   git push -u origin main
   ```

2. **Connect to AWS Amplify**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "GitHub"
   - Select your repository
   - Build settings:
     - Framework: **Next.js**
     - Build command: `npm run build`
     - Output directory: `.next`
   - Click "Deploy"

### Option 2: AWS EC2 + Docker

1. **Build the Docker image**
   ```bash
   docker build -t excellere .
   ```

2. **Push to Amazon ECR**
   ```bash
   aws ecr create-repository --repository-name excellere
   docker tag excellere:latest YOUR_ACCOUNT.dkr.ecr.REGION.amazonaws.com/excellere:latest
   docker push YOUR_ACCOUNT.dkr.ecr.REGION.amazonaws.com/excellere:latest
   ```

3. **Deploy to ECS**
   - Create ECS cluster
   - Create Task Definition
   - Create Service
   - Configure Application Load Balancer

### Option 3: AWS Lightsail (Simple)

1. Launch Lightsail instance (Ubuntu 20.04)
2. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
3. Clone repo and deploy:
   ```bash
   git clone https://github.com/YOUR_USERNAME/excellere.git
   cd excellere
   npm install
   npm run build
   PORT=80 npm start
   ```
4. Configure static IP & firewall

## 📁 Project Structure

```
excellere/
├── app/                    # Next.js App Router
│   ├── page.js            # Landing page
│   ├── globals.css       # Global styles
│   ├── signup/           # Signup page
│   ├── login/           # Login page
│   └── dashboard/        # User dashboard
├── public/               # Static assets
│   └── images/
├── package.json
├── next.config.js
└── README.md
```

## 🔧 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** JavaScript
- **Styling:** CSS Modules + CSS Variables
- **Fonts:** Montserrat, Source Sans Pro, Inknut Antiqua
- **Deployment:** AWS Amplify / EC2 / Lightsail

## 📄 License

Private — All rights reserved © 2025 Excellere

## 👤 Author

Danny Goh
- Website: https://excellere.ai
- Email: danny@excellere.ai
