# Paivot - Next.js Application

A modern web application built with Next.js, Prisma, and NextAuth.js.

## Project Setup

### Quick Setup (Recommended)

We've created a setup script to make it easy to get started:

```bash
# Clone the repository
git clone https://github.com/paivotdemo/paivotdemo.git
cd paivotdemo

# Run the setup script
./setup.sh
```

The setup script will:
1. Create environment files from templates
2. Install dependencies
3. Generate the Prisma client
4. Optionally run database migrations

### Manual Setup

If you prefer to set up manually:

1. Clone the repository:
   ```bash
   git clone https://github.com/paivotdemo/paivotdemo.git
   cd paivotdemo
   ```

2. Create environment files:
   ```bash
   cp .env.example .env
   cp .env.example .env.local
   ```

3. Edit the `.env` and `.env.local` files with your actual credentials.

4. Install dependencies:
   ```bash
   yarn install
   ```

5. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

6. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

## Database Setup

### Option 1: Remote Database (Recommended for Team Development)

For seamless development across multiple machines, we recommend using a shared remote database:

1. Create a PostgreSQL database on [Supabase](https://supabase.com/), [Railway](https://railway.app/), or [Neon](https://neon.tech/)
2. Update your `.env` file with the connection string

### Option 2: Local Database

For local development:

1. Install PostgreSQL on your machine
2. Create a database
3. Update your `.env` file with the local connection string
4. Run migrations: `npx prisma migrate dev`

## Development

Start the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication

This project uses NextAuth.js for authentication. To set up authentication:

1. Configure your OAuth providers in the `.env` file
2. For local development, set `NEXTAUTH_URL="http://localhost:3000"`
3. Generate a secure random string for `NEXTAUTH_SECRET`

## Deployment

### Deploy on Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

1. Connect your GitHub repository to Vercel
2. Configure environment variables in the Vercel dashboard
3. Deploy with a single click

### Other Deployment Options

- [Netlify](https://netlify.com)
- [Railway](https://railway.app)
- [Render](https://render.com)

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

[MIT](LICENSE)
