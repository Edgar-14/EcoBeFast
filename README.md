# EcoBeFast - Sustainable Delivery Platform

EcoBeFast is a modern delivery platform that connects businesses with eco-friendly delivery drivers, promoting sustainable last-mile delivery solutions.

## ✨ Features

- **Business Management**: Complete order management system with credit-based billing
- **Driver Management**: Application system with document verification and payroll management
- **Admin Panel**: Comprehensive administrative dashboard with real-time metrics
- **Real-time Tracking**: Google Maps integration for precise order tracking and geocoding
- **Payment Processing**: Full Stripe integration for secure credit purchases
- **Email Notifications**: Automated notification system for order updates
- **Legal Compliance**: IMSS integration and Mexican labor classification management

## 🛠 Tech Stack

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Firebase (Firestore, Functions, Authentication)
- **Maps**: Google Maps API for geocoding and routing
- **Payments**: Stripe for secure payment processing
- **Email**: Gmail SMTP for transactional emails
- **Forms**: React Hook Form with Zod validation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project setup
- Google Maps API key
- Stripe account (test/production)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Edgar-14/EcoBeFast.git
cd EcoBeFast
```

2. Install dependencies:
```bash
npm install
cd functions && npm install && cd ..
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```
Fill in the required environment variables (see Configuration section).

4. Build Firebase Functions:
```bash
cd functions && npm run build && cd ..
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard and management
│   ├── delivery/          # Business delivery interface
│   └── drivers/           # Driver portal
├── components/            # Reusable React components
│   ├── auth/             # Authentication components
│   └── ui/               # UI components
├── lib/                  # Utilities and configurations
│   ├── firebase/         # Firebase configuration
│   ├── services/         # API services and business logic
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Helper functions
functions/                 # Firebase Functions backend
scripts/                  # Deployment and testing scripts
```

## ⚙️ Configuration

### Firebase Configuration
Set up these environment variables for Firebase:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... see .env.local.example for complete list
```

### Google Maps API
Enable these APIs in Google Cloud Console:
- Geocoding API
- Places API
- Maps JavaScript API

### Stripe Configuration
For payment processing:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_or_pk_live_...
STRIPE_SECRET_KEY=sk_test_or_sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 🏗 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Deployment
- `npm run deploy` - Deploy to Firebase (staging)
- `npm run deploy:production` - Deploy to production
- `npm run test:smoke` - Run smoke tests
- `npm run test:production` - Run production smoke tests

## 🚢 Production Deployment

### Quick Deploy
```bash
npm run deploy:production
```

### Manual Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment guide.

### Pre-deployment Checklist
- [ ] All environment variables configured
- [ ] Firebase project set up with proper security rules
- [ ] Google Maps API with production limits
- [ ] Stripe configured for production
- [ ] Email service configured
- [ ] Domain configured (if using custom domain)

## 🔐 Security Features

- **Firestore Security Rules**: Comprehensive access control
- **Firebase Authentication**: Secure user management with custom claims
- **Role-based Access Control**: Admin, Business, and Driver roles
- **API Key Restrictions**: Google Maps and other APIs properly restricted
- **Webhook Validation**: Stripe webhook signature verification
- **Input Validation**: Zod schemas for all user inputs

## 📊 Admin Dashboard

The admin dashboard provides real-time insights into:
- Order metrics and status tracking
- Driver and business management
- Payment and credit monitoring
- System health status
- Audit logs and reporting

![Admin Dashboard](https://github.com/user-attachments/assets/8ccc0717-bbd1-4e4e-8d33-435a7999f10f)

## 🧪 Testing

### Smoke Tests
Comprehensive test suite validating:
- Firebase connectivity and authentication
- Database operations and security rules
- External API integrations (Maps, Stripe)
- Application performance and accessibility

Run tests:
```bash
npm run test:smoke
```

## 📈 Features Implemented

### Core Business Logic
- ✅ Complete order lifecycle management
- ✅ Credit-based billing system
- ✅ Real-time order status tracking
- ✅ Driver assignment algorithms
- ✅ Payment processing with Stripe
- ✅ Email notification system

### User Interfaces
- ✅ Business dashboard for order management
- ✅ Admin panel with comprehensive metrics
- ✅ Driver application and management system
- ✅ Responsive design for mobile and desktop

### Integrations
- ✅ Google Maps for address geocoding
- ✅ Stripe for payment processing
- ✅ Gmail SMTP for email notifications
- ✅ Firebase for authentication and data storage

### Production Ready
- ✅ Environment configuration for staging/production
- ✅ Automated deployment scripts
- ✅ Comprehensive error handling
- ✅ Security rules and access controls
- ✅ Performance optimization
- ✅ Monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint && npm run test:smoke`)
5. Commit your changes (`git commit -am 'Add new feature'`)
6. Push to the branch (`git push origin feature/new-feature`)
7. Submit a pull request

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 📞 Support

For support and questions:
- Email: soporte@befastapp.com.mx
- Documentation: See [DEPLOYMENT.md](DEPLOYMENT.md)
- Issues: Create an issue in this repository

---

**Built with ❤️ for sustainable delivery solutions in Mexico**