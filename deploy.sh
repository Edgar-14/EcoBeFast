#!/bin/bash
set -e

echo "🚀 Starting EcoBeFast deployment to production..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    print_error "Firebase CLI not found. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    print_error "Not logged in to Firebase. Please run: firebase login"
    exit 1
fi

# Environment check
if [ -z "$NODE_ENV" ]; then
    export NODE_ENV="production"
fi

print_status "Environment: $NODE_ENV"

# 1. Install dependencies
print_status "Installing dependencies..."
npm ci

# 2. Install functions dependencies
print_status "Installing Firebase Functions dependencies..."
cd functions
npm ci
cd ..

# 3. Build the project
print_status "Building Next.js application..."
npm run build

# 4. Build Firebase Functions
print_status "Building Firebase Functions..."
cd functions
npm run build
cd ..

# 5. Run linting
print_status "Running ESLint..."
npm run lint

# 6. Deploy to Firebase
print_status "Deploying to Firebase..."

# Deploy functions first
print_status "Deploying Firebase Functions..."
firebase deploy --only functions

# Deploy Firestore rules and indexes
print_status "Deploying Firestore rules and indexes..."
firebase deploy --only firestore

# Deploy hosting
print_status "Deploying Firebase Hosting..."
firebase deploy --only hosting

print_status "Deployment completed successfully! 🎉"

# Get the hosting URL
PROJECT_ID=$(firebase projects:list --json | jq -r '.[] | select(.state=="ACTIVE") | .projectId' | head -n 1)
if [ ! -z "$PROJECT_ID" ]; then
    echo ""
    echo "🌐 Your app is live at: https://${PROJECT_ID}.web.app"
    echo "🔗 Admin panel: https://${PROJECT_ID}.web.app/admin/login"
    echo ""
fi

print_status "Post-deployment checklist:"
echo "  □ Test all user flows (business, driver, admin)"
echo "  □ Verify payment processing"
echo "  □ Check email notifications"
echo "  □ Monitor Firebase Functions logs"
echo "  □ Verify security rules are working"
echo "  □ Test Google Maps integration"

echo ""
print_warning "Don't forget to:"
echo "  - Set up monitoring and alerts"
echo "  - Configure custom domain (if needed)"
echo "  - Set up backup strategy"
echo "  - Review and test security rules"
echo "  - Configure production environment variables"