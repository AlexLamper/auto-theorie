const Stripe = require('stripe');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables (try .env.local first, then .env)
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('❌ STRIPE_SECRET_KEY is niet gevonden in .env');
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey);

async function setupStripe() {
  console.log('🚀 Bezig met aanmaken van Stripe Producten en Prijzen...');

  const plans = [
    {
      id: 'plan_basic',
      name: 'Basic (1 Dag)',
      price: 1999, // in cents
      description: '24 uur toegang tot alle auto theorie materialen',
    },
    {
      id: 'plan_pro',
      name: 'Pro (7 Dagen)',
      price: 2499, // in cents
      description: '7 dagen toegang tot alle auto theorie materialen',
    },
    {
      id: 'plan_premium',
      name: 'Premium (31 Dagen)',
      price: 2999, // in cents
      description: '31 dagen toegang tot alle auto theorie materialen',
    },
  ];

  const bundles = [
    {
      id: 'bundle_5',
      name: '5 Examens Bundel',
      price: 1495,
      description: 'Bundel van 5 extra willekeurige examens',
    },
    {
      id: 'bundle_10',
      name: '10 Examens Bundel',
      price: 2495,
      description: 'Bundel van 10 extra willekeurige examens',
    },
    {
      id: 'bundle_20',
      name: '20 Examens Bundel',
      price: 3995,
      description: 'Bundel van 20 extra willekeurige examens',
    },
  ];

  const results = {};

  for (const plan of plans) {
    try {
      console.log(`\n📦 Aanmaken product: ${plan.name}...`);
      
      const product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: {
          planId: plan.id
        }
      });

      const price = await stripe.prices.create({
        unit_amount: plan.price,
        currency: 'eur',
        product: product.id,
      });

      console.log(`✅ Succes! Price ID: ${price.id}`);
      results[plan.id] = price.id;
    } catch (error) {
      console.error(`❌ Fout bij ${plan.name}:`, error.message);
    }
  }

  for (const bundle of bundles) {
    try {
      console.log(`\n📦 Aanmaken bundel: ${bundle.name}...`);
      
      const product = await stripe.products.create({
        name: bundle.name,
        description: bundle.description,
        metadata: {
          planId: bundle.id
        }
      });

      const price = await stripe.prices.create({
        unit_amount: bundle.price,
        currency: 'eur',
        product: product.id,
      });

      console.log(`✅ Succes! Price ID: ${price.id}`);
      results[bundle.id] = price.id;
    } catch (error) {
      console.error(`❌ Fout bij ${bundle.name}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('🎉 Stripe Setup Voltooid!');
  console.log('Voeg de volgende regels toe aan je .env bestand:');
  console.log('='.repeat(50));
  console.log(`STRIPE_PRICE_BASIC=${results.plan_basic || 'FOUT'}`);
  console.log(`STRIPE_PRICE_PRO=${results.plan_pro || 'FOUT'}`);
  console.log(`STRIPE_PRICE_PREMIUM=${results.plan_premium || 'FOUT'}`);
  console.log(`STRIPE_PRICE_BUNDLE_5=${results.bundle_5 || 'FOUT'}`);
  console.log(`STRIPE_PRICE_BUNDLE_10=${results.bundle_10 || 'FOUT'}`);
  console.log(`STRIPE_PRICE_BUNDLE_20=${results.bundle_20 || 'FOUT'}`);
  console.log('='.repeat(50));
}

setupStripe();
