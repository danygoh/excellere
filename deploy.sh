#!/bin/bash
# Deploy to AWS EC2

# Configuration
INSTANCE_IP="YOUR_EC2_IP"
SSH_KEY="~/.ssh/your-key.pem"
APP_DIR="/var/www/excellere"

echo "🚀 Deploying Excellere to AWS..."

# Build locally
echo "📦 Building..."
npm run build

# Transfer to server
echo "📤 Transferring to server..."
scp -r -i $SSH_KEY . ubuntu@$INSTANCE_IP:$APP_DIR

# Deploy on server
echo "🚀 Deploying on server..."
ssh -i $SSH_KEY ubuntu@$INSTANCE_IP << 'ENDSSH'
  cd $APP_DIR
  docker-compose down
  docker-compose build --no-cache
  docker-compose up -d
ENDSSH

echo "✅ Deployed! Visit http://$INSTANCE_IP"
