#!/bin/bash

echo "=================================="
echo "Deploy Encrypted Pastebin to Vercel"
echo "=================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found!"
    echo ""
    echo "Install with:"
    echo "  npm install -g vercel"
    echo ""
    exit 1
fi

echo "✓ Vercel CLI found"
echo ""

# Ask which service to deploy
echo "What do you want to deploy?"
echo "1. Pastebin service only"
echo "2. Website only"
echo "3. Both"
echo ""
read -p "Enter choice (1-3): " choice

deploy_pastebin() {
    echo ""
    echo "Deploying pastebin service..."
    cd pastebin

    echo "Running: vercel --prod"
    vercel --prod

    echo ""
    echo "✅ Pastebin deployed!"
    echo ""
    echo "Don't forget to set environment variables:"
    echo "  vercel env add SUPABASE_URL"
    echo "  vercel env add SUPABASE_KEY"
    echo "  vercel env add PORT"
    echo ""
    cd ..
}

deploy_website() {
    echo ""
    echo "Deploying website..."
    cd website

    echo "Running: vercel --prod"
    vercel --prod

    echo ""
    echo "✅ Website deployed!"
    echo ""
    echo "Don't forget to set environment variables:"
    echo "  vercel env add PASTEBIN_URL"
    echo "  vercel env add SITE_ID"
    echo "  vercel env add SECRET_KEY"
    echo ""
    cd ..
}

case $choice in
    1)
        deploy_pastebin
        ;;
    2)
        deploy_website
        ;;
    3)
        deploy_pastebin
        deploy_website
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "=================================="
echo "Deployment Complete!"
echo "=================================="
echo ""
echo "View your deployments:"
echo "  https://vercel.com/dashboard"
echo ""
echo "See DEPLOY_VERCEL.md for full instructions"
echo ""
