#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up Paivot development environment...${NC}"

# Check if .env file exists
if [ ! -f .env ]; then
  echo -e "${YELLOW}Creating .env file from example...${NC}"
  cp .env.example .env
  echo -e "${YELLOW}Please edit the .env file with your actual credentials.${NC}"
else
  echo -e "${GREEN}.env file already exists.${NC}"
fi

# Check if .env.local file exists
if [ ! -f .env.local ]; then
  echo -e "${YELLOW}Creating .env.local file from example...${NC}"
  cp .env.example .env.local
  echo -e "${YELLOW}Please edit the .env.local file with your actual credentials.${NC}"
else
  echo -e "${GREEN}.env.local file already exists.${NC}"
fi

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
yarn install

# Check if Prisma client needs to be generated
echo -e "${GREEN}Generating Prisma client...${NC}"
npx prisma generate

# Ask if user wants to run migrations
read -p "Do you want to run database migrations? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${GREEN}Running database migrations...${NC}"
  npx prisma migrate dev
else
  echo -e "${YELLOW}Skipping database migrations.${NC}"
fi

echo -e "${GREEN}Setup complete! You can now run 'yarn dev' to start the development server.${NC}" 