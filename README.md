# Paivot Demo

A modern web application built with Next.js and Supabase, hosted on AWS Amplify.

## Architecture

- **Frontend**: Next.js 14 with App Router
- **Authentication & Database**: Supabase
- **Hosting**: AWS Amplify
- **Styling**: Tailwind CSS

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

## Supabase Integration

This project uses Supabase for authentication and data storage:

### Authentication
- Email/password login
- Social logins (Google, Apple, LinkedIn)
- Session management

### Database
- User profiles stored in Supabase
- PostgreSQL database with real-time capabilities
- Row Level Security (RLS) for data protection

## AWS Amplify Deployment

The application is deployed using AWS Amplify, which provides:

1. **Continuous Deployment**
   - Automatic builds from GitHub
   - Preview environments for pull requests

2. **Environment Configuration**
   - Environment variables management
   - Domain and hosting configuration

3. **Monitoring and Logs**
   - Build and deployment logs
   - Performance monitoring

### Deploying to AWS Amplify

1. Connect your GitHub repository to AWS Amplify
2. Configure the build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - yarn install
       build:
         commands:
           - yarn build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
         - .next/cache/**/*
   ```
3. Add environment variables in the Amplify Console
4. Deploy your application

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## Troubleshooting

For current issues and status, see [CURRENT_STATUS.md](./CURRENT_STATUS.md).

## License

[MIT](LICENSE)
