#!/bin/bash

echo "=================================="
echo "Encrypted Pastebin - RESET"
echo "=================================="
echo ""
echo "⚠️  WARNING: This will DELETE ALL data!"
echo "   - All pastes will be removed"
echo "   - Site registration will be removed"
echo "   - You will need to re-register"
echo ""
read -p "Are you sure? Type 'yes' to continue: " confirm

if [ "$confirm" != "yes" ]; then
    echo "Reset cancelled."
    exit 0
fi

echo ""
echo "Resetting encrypted pastebin..."
echo ""

# Change to pastebin directory
cd pastebin

# Run the reset script
node reset-db.js

echo ""
echo "=================================="
echo "Reset complete!"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Restart both services if running"
echo "2. Go to http://localhost:3000"
echo "3. Click 'Register Site' to re-register"
echo "4. Start fresh!"
echo ""
