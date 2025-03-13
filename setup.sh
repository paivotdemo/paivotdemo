#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env and .env.local files exist
if [ ! -f .env ] || [ ! -f .env.local ]; then
  echo -e "${YELLOW}Creating environment files...${NC}"
  
  # Create .env file if it doesn't exist
  if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}.env file created${NC}"
  else
    echo -e "${YELLOW}.env file already exists${NC}"
  fi
  
  # Create .env.local file if it doesn't exist
  if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo -e "${GREEN}.env.local file created${NC}"
  else
    echo -e "${YELLOW}.env.local file already exists${NC}"
  fi
  
  echo -e "${YELLOW}Please update your .env and .env.local files with your actual credentials${NC}"
fi

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
yarn install

echo -e "${GREEN}Setup complete!${NC}"
echo -e "${YELLOW}To start the development server, run:${NC} yarn dev" 