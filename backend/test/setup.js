import dotenv from 'dotenv';

// Charger les variables d'environnement pour les tests
dotenv.config({ path: '.env.test' });

// Augmenter le timeout pour les tests
jest.setTimeout(30000);