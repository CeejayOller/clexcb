This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# CLEXCB - Customs Brokerage Management System

A comprehensive web application for managing customs brokerage operations in the Philippines. Built with Next.js, Prisma, and TypeScript.

## Features

- Import/Export Documentation Management
- Customs Declaration Processing
- E2M Integration
- Client Management (Consignees & Exporters)
- Document Tracking
- Statement of Facts Generation
- Role-based Access Control

## Prerequisites

- Node.js 18.x or higher
- PostgreSQL 14.x or higher
- npm or yarn package manager

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/clexcb.git
cd clexcb
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your configuration values.

4. Initialize the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/              # Next.js 13+ app directory
├── components/       # Reusable React components
├── lib/             # Utility functions and configurations
├── types/           # TypeScript type definitions
└── prisma/          # Database schema and migrations
```

## Development Guidelines

- Follow the existing code style and formatting
- Write meaningful commit messages
- Create feature branches for new development
- Add appropriate tests for new features
- Update documentation as needed

## Database Schema

The application uses Prisma ORM with PostgreSQL. Key models include:
- Users (Admins, Brokers, Clients)
- Shipments (Import/Export)
- Consignees
- Exporters
- Documents

## Authentication & Authorization

- JWT-based authentication
- Role-based access control (RBOC)
- Session management
- Secure password handling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Support

For support, email info@cloudexpresscb.com or open an issue in the GitHub repository.