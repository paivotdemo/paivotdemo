# Paivot Demo

A modern web application built with Next.js and Supabase.

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/paivotdemo/paivotdemo.git
   cd paivotdemo
   ```

2. Create environment files:
   ```bash
   cp .env.example .env.local
   ```

3. Edit the `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Install dependencies:
   ```bash
   yarn install
   ```

5. Start the development server:
   ```bash
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication

This project uses Supabase for authentication. It supports:

- Email/password authentication
- Social logins (Google, Apple, LinkedIn)
- User profiles stored in Supabase

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
