# EcoBeFast

EcoBeFast is a modern delivery platform that connects businesses with eco-friendly delivery drivers, promoting sustainable last-mile delivery solutions.

## Features

- **Business Management**: Order management, credit system, billing dashboard
- **Driver Management**: Application system, document verification, payroll management
- **Admin Panel**: Complete oversight of operations, driver applications, system configuration
- **Real-time Tracking**: Google Maps integration for order tracking
- **Payment Processing**: Stripe integration for credit purchases
- **Legal Compliance**: IMSS integration and labor classification management

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Firebase (Firestore, Functions, Authentication)
- **Maps**: Google Maps API
- **Payments**: Stripe
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project setup
- Google Maps API key
- Stripe account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Edgar-14/EcoBeFast.git
cd EcoBeFast
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```
Fill in the required environment variables.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
├── components/           # Reusable React components
│   └── ui/              # UI components
├── lib/                 # Utilities and configurations
│   ├── firebase/        # Firebase configuration
│   ├── services/        # API services
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Helper functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run deploy` - Build and deploy to Firebase

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is proprietary and confidential.