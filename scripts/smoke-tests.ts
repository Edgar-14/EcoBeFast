#!/usr/bin/env tsx

/**
 * EcoBeFast Application Smoke Tests
 * 
 * Comprehensive test suite to validate core functionality
 * after deployment to production or staging environment.
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs, query, limit } from 'firebase/firestore';

// Test configuration
const TEST_CONFIG = {
  // Use production config for smoke tests
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },
  
  // Test accounts (create these manually in production)
  testAccounts: {
    admin: {
      email: 'admin.test@befastapp.com.mx',
      password: 'TestAdmin123!'
    },
    business: {
      email: 'business.test@befastapp.com.mx',
      password: 'TestBusiness123!'
    },
    driver: {
      email: 'driver.test@befastapp.com.mx',
      password: 'TestDriver123!'
    }
  },

  appUrl: process.env.APP_URL || 'http://localhost:3000',
  timeouts: {
    default: 30000,
    navigation: 10000
  }
};

// Test results
interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'skip';
  duration: number;
  error?: string;
}

const results: TestResult[] = [];

// Utility functions
function log(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    error: '\x1b[31m',   // Red
    warning: '\x1b[33m'  // Yellow
  };
  
  const icons = {
    info: 'ℹ',
    success: '✓',
    error: '✗',
    warning: '⚠'
  };

  console.log(`${colors[type]}${icons[type]} ${message}\x1b[0m`);
}

async function runTest(name: string, testFn: () => Promise<void>): Promise<void> {
  const startTime = Date.now();
  
  try {
    log(`Running: ${name}`, 'info');
    await testFn();
    
    const duration = Date.now() - startTime;
    results.push({ name, status: 'pass', duration });
    log(`✓ ${name} (${duration}ms)`, 'success');
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    results.push({ name, status: 'fail', duration, error: errorMessage });
    log(`✗ ${name} (${duration}ms): ${errorMessage}`, 'error');
  }
}

// Initialize Firebase for tests
const app = initializeApp(TEST_CONFIG.firebase);
const auth = getAuth(app);
const db = getFirestore(app);

// Test Suite
async function testFirebaseConnection() {
  // Test basic Firestore connection
  const testDoc = doc(db, 'test', 'connection');
  await getDoc(testDoc);
}

async function testAuthenticationFlow() {
  // Test admin login
  const userCredential = await signInWithEmailAndPassword(
    auth,
    TEST_CONFIG.testAccounts.admin.email,
    TEST_CONFIG.testAccounts.admin.password
  );
  
  if (!userCredential.user) {
    throw new Error('Admin authentication failed');
  }
  
  // Verify admin custom claims
  const idTokenResult = await userCredential.user.getIdTokenResult();
  if (!idTokenResult.claims.ADMIN && !idTokenResult.claims.SUPER_ADMIN) {
    throw new Error('Admin user does not have proper custom claims');
  }
}

async function testDatabaseCollections() {
  const collections = ['businesses', 'drivers', 'orders', 'adminActions'];
  
  for (const collectionName of collections) {
    const q = query(collection(db, collectionName), limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty && collectionName === 'businesses') {
      throw new Error(`Critical collection '${collectionName}' is empty`);
    }
  }
}

async function testWebApplicationRoutes() {
  const routes = [
    '/',
    '/delivery/login',
    '/admin/login',
    '/drivers/login'
  ];

  for (const route of routes) {
    const url = `${TEST_CONFIG.appUrl}${route}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Route ${route} returned ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    if (!html.includes('BeFast') && !html.includes('EcoBeFast')) {
      throw new Error(`Route ${route} does not appear to be loading the application`);
    }
  }
}

async function testGoogleMapsIntegration() {
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!mapsApiKey) {
    throw new Error('Google Maps API key not configured');
  }

  // Test geocoding API
  const testAddress = 'Ciudad de México, CDMX, México';
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(testAddress)}&key=${mapsApiKey}`;
  
  const response = await fetch(geocodeUrl);
  const data = await response.json();
  
  if (data.status !== 'OK' || !data.results || data.results.length === 0) {
    throw new Error(`Google Maps geocoding failed: ${data.status} - ${data.error_message || 'Unknown error'}`);
  }
}

async function testStripeConfiguration() {
  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  
  if (!stripeKey) {
    throw new Error('Stripe publishable key not configured');
  }

  if (!stripeKey.startsWith('pk_')) {
    throw new Error('Invalid Stripe publishable key format');
  }

  // In production, this should start with pk_live_
  if (process.env.NODE_ENV === 'production' && !stripeKey.startsWith('pk_live_')) {
    log('Warning: Using test Stripe key in production environment', 'warning');
  }
}

async function testEmailConfiguration() {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPassword = process.env.GMAIL_APP_PASSWORD;
  
  if (!gmailUser || !gmailPassword) {
    throw new Error('Gmail SMTP configuration missing');
  }

  if (!gmailUser.includes('@befastapp.com.mx')) {
    throw new Error('Gmail user should be a BeFast domain email');
  }
}

async function testFirebaseFunctions() {
  // Test if functions are deployed by calling a simple health check
  const healthCheckUrl = `https://us-central1-${TEST_CONFIG.firebase.projectId}.cloudfunctions.net/healthCheck`;
  
  try {
    const response = await fetch(healthCheckUrl);
    const data = await response.json();
    
    if (!data.status || data.status !== 'healthy') {
      throw new Error('Health check function returned invalid response');
    }
  } catch (error) {
    throw new Error(`Firebase Functions health check failed: ${error}`);
  }
}

// Performance tests
async function testApplicationPerformance() {
  const startTime = Date.now();
  const response = await fetch(TEST_CONFIG.appUrl);
  const loadTime = Date.now() - startTime;
  
  if (loadTime > 5000) {
    throw new Error(`Application load time too slow: ${loadTime}ms (should be < 5000ms)`);
  }
  
  if (!response.ok) {
    throw new Error(`Application not accessible: ${response.status}`);
  }
}

// Main test runner
async function runSmokeTests() {
  log('🚀 Starting EcoBeFast Smoke Tests', 'info');
  log(`Environment: ${process.env.NODE_ENV || 'development'}`, 'info');
  log(`App URL: ${TEST_CONFIG.appUrl}`, 'info');
  log('', 'info');

  // Critical tests
  await runTest('Firebase Connection', testFirebaseConnection);
  await runTest('Authentication Flow', testAuthenticationFlow);
  await runTest('Database Collections', testDatabaseCollections);
  await runTest('Web Application Routes', testWebApplicationRoutes);
  
  // Integration tests
  await runTest('Google Maps Integration', testGoogleMapsIntegration);
  await runTest('Stripe Configuration', testStripeConfiguration);
  await runTest('Email Configuration', testEmailConfiguration);
  await runTest('Firebase Functions', testFirebaseFunctions);
  
  // Performance tests
  await runTest('Application Performance', testApplicationPerformance);

  // Results summary
  log('', 'info');
  log('📊 Test Results Summary', 'info');
  log('', 'info');

  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const skipped = results.filter(r => r.status === 'skip').length;
  const total = results.length;

  log(`Total tests: ${total}`, 'info');
  log(`Passed: ${passed}`, passed === total ? 'success' : 'info');
  
  if (failed > 0) {
    log(`Failed: ${failed}`, 'error');
    log('', 'info');
    log('Failed tests:', 'error');
    results.filter(r => r.status === 'fail').forEach(test => {
      log(`  • ${test.name}: ${test.error}`, 'error');
    });
  }
  
  if (skipped > 0) {
    log(`Skipped: ${skipped}`, 'warning');
  }

  const avgDuration = results.reduce((sum, test) => sum + test.duration, 0) / results.length;
  log(`Average test duration: ${Math.round(avgDuration)}ms`, 'info');

  log('', 'info');
  
  if (failed === 0) {
    log('🎉 All smoke tests passed! Application is ready for production.', 'success');
    process.exit(0);
  } else {
    log('❌ Some tests failed. Please fix the issues before deploying to production.', 'error');
    process.exit(1);
  }
}

// Run tests if called directly
if (require.main === module) {
  runSmokeTests().catch(error => {
    log(`Smoke tests crashed: ${error.message}`, 'error');
    process.exit(1);
  });
}

export { runSmokeTests };