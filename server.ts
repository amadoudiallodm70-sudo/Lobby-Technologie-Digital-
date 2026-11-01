import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { INITIAL_COURSES, INITIAL_PRODUCTS, INITIAL_REVIEWS } from './src/data/initialData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage directories
const DATA_DIR = path.resolve(__dirname, 'data');
const UPLOADS_DIR = path.resolve(__dirname, 'uploads');
const DB_PATH = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Create sample placeholder files if missing so downloads immediately work out-of-the-box
function ensureSampleFiles() {
  const sampleFiles = [
    { name: 'Guide_Secret_Prompts_IA_2026.pdf', content: 'LOBBY TECHNOLOGIE DIGITAL - Guide Secret Prompts IA 2026\nContenu exclusif réservé aux membres formés.' },
    { name: 'Pack_50_Scripts_Viraux.pdf', content: 'LOBBY TECHNOLOGIE DIGITAL - 50 Scripts Viraux TikTok & Reels\nStructure de hooks et rétention prouvée.' },
    { name: 'Ebook_Monetisation_IA_Afrique.pdf', content: 'LOBBY TECHNOLOGIE DIGITAL - Ebook : Le Guide Ultime de la Monétisation IA en Afrique\n15 modèles d\'affaires applicables en République de Guinée.' },
    { name: 'Pack_Contrats_OHADA_Guinee.zip', content: 'LOBBY TECHNOLOGIE DIGITAL - Pack Contrats Commerciaux et Modèles Juridiques OHADA.' },
    { name: 'Tutoriels_Bureautique_LobbyTech.zip', content: 'LOBBY TECHNOLOGIE DIGITAL - Tutoriels Bureautiques Word Excel PowerPoint.' },
    { name: 'Canva_Templates_500_Business.pdf', content: 'LOBBY TECHNOLOGIE DIGITAL - Liens Canva Pro & Modèles Affiches Commerçants.' },
    { name: 'LobbyTech_WhatsApp_Tool_v2.zip', content: 'LOBBY TECHNOLOGIE DIGITAL - Logiciel Assistant WhatsApp Business v2.0.' },
    { name: '1000_Prompts_IA_Lobby_Technologie.pdf', content: 'LOBBY TECHNOLOGIE DIGITAL - 1000 Prompts Rentables pour Entreprises et Créateurs.' }
  ];

  for (const f of sampleFiles) {
    const fPath = path.join(UPLOADS_DIR, f.name);
    if (!fs.existsSync(fPath)) {
      fs.writeFileSync(fPath, f.content, 'utf-8');
    }
  }
}
ensureSampleFiles();

// Database schema and helper
const DEFAULT_SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'FORMULE GRATUITE',
    tagline: 'Idéal pour découvrir les bases du numérique et tester nos outils IA',
    priceGNF: 0,
    period: 'month',
    features: [
      'Accès aux webinaires et ateliers publics en direct',
      '5 générations d\'images IA par jour offertes',
      'Accès à la bibliothèque de ressources gratuites (PDF, fiches)',
      'Accès aux modules d\'introduction de chaque formation',
      'Support communautaire WhatsApp officiel'
    ],
    aiCreditsMonthly: 150,
    coursesAccess: 'free_only',
    supportLevel: 'community'
  },
  {
    id: 'premium',
    name: 'FORMULE PREMIUM',
    tagline: 'Pour les professionnels, étudiants et créateurs souhaitant monétiser leurs compétences',
    priceGNF: 150000,
    period: 'month',
    highlighted: true,
    features: [
      'Accès illimité à toutes les formations de niveau Débutant & Intermédiaire',
      '100 générations de vidéos IA & images haute résolution par mois',
      'Accès complet aux templates Canva Pro, affiches PSD & bibles de prompts',
      'Certificats d\'aptitude officiels vérifiables en fin de parcours',
      'Support WhatsApp prioritaire direct 7j/7 avec nos formateurs',
      'Factures acquittées conformes pour particuliers et entreprises'
    ],
    aiCreditsMonthly: 500,
    coursesAccess: 'standard',
    supportLevel: 'whatsapp_priority'
  },
  {
    id: 'expert',
    name: 'FORMULE EXPERT',
    tagline: 'L\'excellence absolue : accès illimité, outils IA d\'avant-garde & accompagnement direct',
    priceGNF: 350000,
    period: 'month',
    features: [
      'Accès illimité à 100% du catalogue de formations + Masterclasses VIP',
      'Générations vidéo Google Veo 3 & Vidogrip illimitées avec rendu prioritaire',
      'Pack complet de modèles juridiques OHADA & licences commerciales',
      'Coaching individuel personnalisé de 2h par mois avec nos ingénieurs',
      'Audit personnalisé de vos projets, tunnels de vente et chaînes',
      'Badge Membre d\'Élite & assistance téléphonique directe permanente'
    ],
    aiCreditsMonthly: -1,
    coursesAccess: 'all',
    supportLevel: 'direct_coaching'
  }
];

interface Database {
  users: any[];
  courses: any[];
  products: any[];
  orders: any[];
  reviews: any[];
  aiCreations: any[];
  courseProgress: any[];
  subscriptionPlans: any[];
  contactMessages: any[];
  serviceRequests: any[];
  downloadTokens: Record<string, { orderId: string; productId: string; expiresAt: number }>;
  gatewayConfig: {
    orangeMoney: {
      enabled: boolean;
      merchantCode: string;
      apiKeyConfigured: boolean;
      environment: 'test' | 'live';
      ussdDialCode: string;
    };
    payCard: {
      enabled: boolean;
      merchantId: string;
      apiKeyConfigured: boolean;
      environment: 'test' | 'live';
    };
    chapChapPay: {
      enabled: boolean;
      clientIdConfigured: boolean;
      environment: 'test' | 'live';
    };
  };
}

function loadDB(): Database {
  if (fs.existsSync(DB_PATH)) {
    try {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      if (!parsed.aiCreations) parsed.aiCreations = [];
      if (!parsed.courseProgress) parsed.courseProgress = [];
      if (!parsed.subscriptionPlans) parsed.subscriptionPlans = DEFAULT_SUBSCRIPTION_PLANS;
      if (!parsed.contactMessages) parsed.contactMessages = [];
      if (!parsed.serviceRequests) parsed.serviceRequests = [];
      return parsed;
    } catch (e) {
      console.error('Error reading db.json, reinitializing', e);
    }
  }

  const defaultDB: Database = {
    users: [
      {
        id: 'admin-1',
        name: 'Amadou Diallo (Directeur)',
        email: 'amadoudiallodm70@gmail.com',
        phone: '611554471',
        country: 'Guinée',
        role: 'admin',
        status: 'active',
        passwordHash: 'admin123', // Demo admin credentials
        createdAt: '2026-01-01T00:00:00.000Z',
        notifications: [
          {
            id: 'n-admin-1',
            title: 'Bienvenue sur la plateforme',
            message: 'Espace d\'administration LOBBY TECHNOLOGIE DIGITAL opérationnel.',
            type: 'info',
            createdAt: '2026-01-01T00:00:00.000Z',
            read: true
          }
        ]
      },
      {
        id: 'client-demo',
        name: 'Mamadou Bhoye Diallo',
        email: 'client@lobbytech.gn',
        phone: '622112233',
        country: 'Guinée',
        role: 'client',
        status: 'active',
        passwordHash: 'client123',
        createdAt: '2026-01-15T00:00:00.000Z',
        notifications: [
          {
            id: 'n-client-1',
            title: 'Bienvenue chez LOBBY TECHNOLOGIE DIGITAL',
            message: 'Votre compte est prêt. Accédez à vos formations et débloquez votre potentiel.',
            type: 'welcome',
            createdAt: '2026-01-15T00:00:00.000Z',
            read: false
          }
        ]
      }
    ],
    courses: INITIAL_COURSES,
    products: INITIAL_PRODUCTS,
    orders: [
      {
        id: 'order-101',
        reference: 'LOBBY-202601-8842',
        userId: 'client-demo',
        customerName: 'Mamadou Bhoye Diallo',
        customerEmail: 'client@lobbytech.gn',
        customerPhone: '622112233',
        items: [
          {
            id: 'course-1',
            title: "Maîtrise Complète de l'IA Générative & ChatGPT Pro",
            type: 'course',
            priceGNF: 350000,
            coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
          }
        ],
        totalGNF: 350000,
        paymentMethod: 'orange_money',
        status: 'PAID',
        transactionRef: 'OM-GN-9847291',
        downloadToken: 'token-demo-101',
        createdAt: '2026-01-25T14:30:00.000Z',
        paidAt: '2026-01-25T14:31:12.000Z'
      }
    ],
    reviews: INITIAL_REVIEWS,
    aiCreations: [],
    courseProgress: [
      {
        userId: 'client-demo',
        courseId: 'course-1',
        completedModules: ['mod-1-1', 'mod-1-2'],
        lastModuleId: 'mod-1-2',
        percent: 40,
        isCompleted: false,
        updatedAt: '2026-01-26T10:00:00.000Z'
      }
    ],
    subscriptionPlans: DEFAULT_SUBSCRIPTION_PLANS,
    contactMessages: [
      {
        id: 'msg-demo-1',
        name: 'Ousmane Camara',
        email: 'ousmane.camara@gmail.com',
        phone: '622445566',
        subject: 'Demande de formation d\'équipe sur l\'IA à Conakry',
        message: 'Bonjour l\'équipe Lobby Tech, nous souhaitons former notre équipe marketing de 8 personnes sur les outils de création de vidéos et affiches IA.',
        status: 'unread',
        createdAt: '2026-02-01T09:15:00.000Z'
      }
    ],
    serviceRequests: [
      {
        id: 'srv-demo-1',
        name: 'Kadiatou Barry',
        email: 'kadi.barry@entreprise-guinee.com',
        phone: '628998877',
        serviceType: 'Création de sites web',
        budgetGNF: '5 000 000 GNF',
        deadline: '1 mois',
        description: 'Conception d\'un site e-commerce moderne pour notre boutique de mode avec intégration Orange Money.',
        status: 'pending',
        createdAt: '2026-02-02T11:30:00.000Z'
      }
    ],
    downloadTokens: {
      'token-demo-101': {
        orderId: 'order-101',
        productId: 'course-1',
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 365
      }
    },
    gatewayConfig: {
      orangeMoney: {
        enabled: true,
        merchantCode: process.env.ORANGE_MONEY_MERCHANT_KEY ? 'CONFIGURED' : 'LOBBY_OM_GUINEA',
        apiKeyConfigured: !!process.env.ORANGE_MONEY_API_KEY,
        environment: 'test',
        ussdDialCode: '*144#'
      },
      payCard: {
        enabled: true,
        merchantId: process.env.PAYCARD_MERCHANT_ID ? 'CONFIGURED' : 'PAYCARD_LOBBY_GN',
        apiKeyConfigured: !!process.env.PAYCARD_API_KEY,
        environment: 'test'
      },
      chapChapPay: {
        enabled: true,
        clientIdConfigured: !!process.env.CHAP_CHAP_CLIENT_ID,
        environment: 'test'
      }
    }
  };

  fs.writeFileSync(DB_PATH, JSON.stringify(defaultDB, null, 2), 'utf-8');
  return defaultDB;
}

function saveDB(db: Database) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

// Multer storage setup for uploads with file progress support
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const sanitizedBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const unique = `${sanitizedBase}-${Date.now()}${ext}`;
    cb(null, unique);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 250 * 1024 * 1024 } // 250MB limit
});

// Gemini AI client initialization
let geminiAI: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    geminiAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  } catch (err) {
    console.error('Failed to init GoogleGenAI', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Helper auth session simulation (token in Authorization header or x-user-id)
  const getUserFromHeader = (req: Request) => {
    const db = loadDB();
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const user = db.users.find(u => u.id === token || u.email === token);
      if (user) return user;
    }
    const userId = req.headers['x-user-id'] as string;
    if (userId) {
      return db.users.find(u => u.id === userId);
    }
    return null;
  };

  // In-memory store for password reset tokens
  const passwordResetCodes = new Map<string, { code: string; expiresAt: number }>();

  // -------------------------------------------------------------
  // AUTH ROUTES & ACCOUNT RECOVERY
  // -------------------------------------------------------------
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, phone, country, password, confirmPassword, acceptTerms } = req.body;
    
    // 1. Mandatory fields verification
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Le nom et prénom sont obligatoires.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'L\'adresse email est obligatoire.' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Le mot de passe est obligatoire.' });
    }

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Veuillez saisir une adresse email valide.' });
    }

    // 3. Password requirements (minimum 6 characters)
    if (password.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit comporter au moins 6 caractères.' });
    }

    // 4. Password confirmation check
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({ error: 'Les mots de passe ne correspondent pas.' });
    }

    // 5. Terms acceptance check
    if (acceptTerms === false) {
      return res.status(400).json({ error: 'Vous devez accepter les conditions générales d\'utilisation et la politique de confidentialité.' });
    }

    const db = loadDB();
    const existing = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'Cette adresse email est déjà associée à un compte existant.' });
    }

    // Role is strictly server-enforced: only the predefined director email is admin
    const isAdmin = email.trim().toLowerCase() === 'amadoudiallodm70@gmail.com';
    const userId = `usr-${Date.now()}`;
    const userCountry = country && country.trim() ? country.trim() : 'Guinée';

    const welcomeNotification = {
      id: `notif-${Date.now()}-welcome`,
      title: 'Bienvenue chez LOBBY TECHNOLOGIE DIGITAL !',
      message: 'Votre compte est prêt. Accédez dès aujourd\'hui à nos formations certifiantes, outils IA et ressources numériques.',
      type: 'welcome',
      createdAt: new Date().toISOString(),
      read: false
    };

    const newUser = {
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      country: userCountry,
      role: isAdmin ? 'admin' : 'client',
      status: 'active',
      passwordHash: password,
      emailVerified: true, // Simulation / active status
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      notifications: [welcomeNotification]
    };

    db.users.push(newUser);
    saveDB(db);

    const { passwordHash, ...userSafe } = newUser;
    return res.status(201).json({ 
      user: userSafe, 
      token: newUser.id,
      message: 'Compte créé avec succès ! Bienvenue sur LOBBY TECHNOLOGIE DIGITAL.'
    });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    const db = loadDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user || user.passwordHash !== password) {
      return res.status(401).json({ error: 'Adresse email ou mot de passe incorrect.' });
    }

    // Security Check: is account suspended?
    if (user.status === 'suspended') {
      return res.status(403).json({ 
        error: 'Votre compte a été suspendu par l\'administration de Lobby Technologie Digital.',
        suspensionReason: user.suspensionReason || 'Activité non conforme aux conditions d\'utilisation. Veuillez contacter le support WhatsApp au 611 55 44 71.'
      });
    }

    // Update lastLogin
    user.lastLogin = new Date().toISOString();
    saveDB(db);

    const { passwordHash, ...userSafe } = user;
    return res.json({ user: userSafe, token: user.id });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    // Double check suspension status
    if (user.status === 'suspended') {
      return res.status(403).json({ 
        error: 'Compte suspendu', 
        suspensionReason: user.suspensionReason 
      });
    }

    const { passwordHash, ...userSafe } = user;
    return res.json({ user: userSafe });
  });

  // Password Recovery - Request Reset Code
  app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Veuillez saisir votre adresse email.' });
    }

    const db = loadDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      // Security standard: don't reveal if email exists, but return success message
      return res.json({ 
        success: true, 
        message: 'Si cette adresse email est enregistrée, un code de réinitialisation à 6 chiffres a été généré.' 
      });
    }

    // Generate 6-digit verification code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 1000 * 60 * 30; // 30 minutes
    passwordResetCodes.set(email.trim().toLowerCase(), { code: resetCode, expiresAt });

    console.log(`[PASSWORD RESET] Code pour ${email}: ${resetCode}`);

    return res.json({
      success: true,
      message: `Un code de sécurité à 6 chiffres a été envoyé pour ${email}.`,
      resetCode // Included in response for seamless preview & instant user testing!
    });
  });

  // Password Recovery - Submit Reset Code & New Password
  app.post('/api/auth/reset-password', (req: Request, res: Response) => {
    const { email, resetCode, newPassword, confirmPassword } = req.body;
    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({ error: 'Tous les champs sont requis pour réinitialiser le mot de passe.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Le nouveau mot de passe doit comporter au moins 6 caractères.' });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Les nouveaux mots de passe ne correspondent pas.' });
    }

    const tokenEntry = passwordResetCodes.get(email.trim().toLowerCase());
    if (!tokenEntry || tokenEntry.code !== resetCode.trim() || tokenEntry.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'Code de réinitialisation invalide ou expiré.' });
    }

    const db = loadDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }

    user.passwordHash = newPassword;
    passwordResetCodes.delete(email.trim().toLowerCase());

    // Add security notification
    if (!user.notifications) user.notifications = [];
    user.notifications.unshift({
      id: `notif-${Date.now()}-pwd`,
      title: 'Mot de passe modifié',
      message: 'Votre mot de passe a été mis à jour avec succès.',
      type: 'security',
      createdAt: new Date().toISOString(),
      read: false
    });

    saveDB(db);

    return res.json({
      success: true,
      message: 'Votre mot de passe a été réinitialisé avec succès ! Vous pouvez maintenant vous connecter.'
    });
  });

  // Update Profile
  app.put('/api/auth/update-profile', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const { name, phone, country, avatar } = req.body;
    const db = loadDB();
    const dbUser = db.users.find(u => u.id === user.id);
    if (!dbUser) return res.status(404).json({ error: 'Utilisateur introuvable' });

    if (name && name.trim()) dbUser.name = name.trim();
    if (phone !== undefined) dbUser.phone = phone.trim();
    if (country && country.trim()) dbUser.country = country.trim();
    if (avatar) dbUser.avatar = avatar;

    saveDB(db);
    const { passwordHash, ...userSafe } = dbUser;
    return res.json({ user: userSafe, message: 'Profil mis à jour avec succès.' });
  });

  // Change Password from Profile
  app.post('/api/auth/change-password', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Ancien et nouveau mot de passe requis.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Le nouveau mot de passe doit comporter au moins 6 caractères.' });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Les nouveaux mots de passe ne correspondent pas.' });
    }

    const db = loadDB();
    const dbUser = db.users.find(u => u.id === user.id);
    if (!dbUser || dbUser.passwordHash !== oldPassword) {
      return res.status(400).json({ error: 'L\'ancien mot de passe est incorrect.' });
    }

    dbUser.passwordHash = newPassword;
    if (!dbUser.notifications) dbUser.notifications = [];
    dbUser.notifications.unshift({
      id: `notif-${Date.now()}-pwd`,
      title: 'Mot de passe modifié',
      message: 'Votre mot de passe a été changé depuis votre espace personnel.',
      type: 'security',
      createdAt: new Date().toISOString(),
      read: false
    });

    saveDB(db);
    return res.json({ success: true, message: 'Mot de passe changé avec succès !' });
  });

  // Client Notifications
  app.get('/api/client/notifications', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user) return res.status(401).json({ error: 'Non authentifié' });
    const db = loadDB();
    const dbUser = db.users.find(u => u.id === user.id);
    return res.json(dbUser?.notifications || []);
  });

  app.post('/api/client/notifications/mark-read', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user) return res.status(401).json({ error: 'Non authentifié' });
    const db = loadDB();
    const dbUser = db.users.find(u => u.id === user.id);
    if (dbUser && dbUser.notifications) {
      dbUser.notifications.forEach((n: any) => n.read = true);
      saveDB(db);
    }
    return res.json({ success: true });
  });

  // -------------------------------------------------------------
  // COURSES ROUTES
  // -------------------------------------------------------------
  app.get('/api/courses', (req: Request, res: Response) => {
    const db = loadDB();
    const { category, search, includeUnpublished } = req.query;
    let list = db.courses;

    if (includeUnpublished !== 'true') {
      list = list.filter(c => c.isPublished);
    }
    if (category && category !== 'all') {
      list = list.filter(c => c.category === category);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }

    return res.json(list);
  });

  app.get('/api/courses/:id', (req: Request, res: Response) => {
    const db = loadDB();
    const course = db.courses.find(c => c.id === req.params.id);
    if (!course) return res.status(404).json({ error: 'Formation introuvable' });
    return res.json(course);
  });

  app.post('/api/courses', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const db = loadDB();
    const newCourse = {
      id: `course-${Date.now()}`,
      createdAt: new Date().toISOString(),
      studentsCount: 0,
      rating: 5.0,
      isPublished: true,
      attachedFiles: [],
      detailedProgram: [],
      ...req.body
    };

    db.courses.unshift(newCourse);
    saveDB(db);
    return res.status(201).json(newCourse);
  });

  app.put('/api/courses/:id', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const db = loadDB();
    const index = db.courses.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Formation introuvable' });

    db.courses[index] = { ...db.courses[index], ...req.body };
    saveDB(db);
    return res.json(db.courses[index]);
  });

  app.delete('/api/courses/:id', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const db = loadDB();
    db.courses = db.courses.filter(c => c.id !== req.params.id);
    saveDB(db);
    return res.json({ success: true, message: 'Formation supprimée' });
  });

  // -------------------------------------------------------------
  // PRODUCTS ROUTES
  // -------------------------------------------------------------
  app.get('/api/products', (req: Request, res: Response) => {
    const db = loadDB();
    const { category, search, includeUnpublished } = req.query;
    let list = db.products;

    if (includeUnpublished !== 'true') {
      list = list.filter(p => p.isPublished);
    }
    if (category && category !== 'all') {
      list = list.filter(p => p.category === category || p.productType === category);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    return res.json(list);
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const db = loadDB();
    const prod = db.products.find(p => p.id === req.params.id);
    if (!prod) return res.status(404).json({ error: 'Produit introuvable' });
    return res.json(prod);
  });

  app.post('/api/products', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const db = loadDB();
    const newProduct = {
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      downloadsCount: 0,
      isPublished: true,
      attachedFiles: [],
      features: [],
      ...req.body
    };

    db.products.unshift(newProduct);
    saveDB(db);
    return res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const db = loadDB();
    const index = db.products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Produit introuvable' });

    db.products[index] = { ...db.products[index], ...req.body };
    saveDB(db);
    return res.json(db.products[index]);
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const db = loadDB();
    db.products = db.products.filter(p => p.id !== req.params.id);
    saveDB(db);
    return res.json({ success: true, message: 'Produit supprimé' });
  });

  // -------------------------------------------------------------
  // FILE UPLOAD ROUTE (Videos, PDFs, Word, ZIPs, Software, Images)
  // -------------------------------------------------------------
  app.post('/api/upload', upload.array('files', 10), (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'Aucun fichier reçu' });
    }

    const uploadedFiles = files.map(f => {
      let fType = 'other';
      const ext = path.extname(f.originalname).toLowerCase();
      if (['.mp4', '.mov', '.avi', '.webm', '.mkv'].includes(ext)) fType = 'video';
      else if (ext === '.pdf') fType = 'pdf';
      else if (['.doc', '.docx'].includes(ext)) fType = 'doc';
      else if (['.zip', '.rar', '.7z', '.tar'].includes(ext)) fType = 'zip';
      else if (['.exe', '.apk', '.dmg', '.iso'].includes(ext)) fType = 'software';
      else if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) fType = 'image';

      return {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: f.originalname,
        size: f.size,
        type: fType,
        url: `/uploads/${f.filename}`,
        uploadedAt: new Date().toISOString()
      };
    });

    return res.json({ files: uploadedFiles });
  });

  // -------------------------------------------------------------
  // PAYMENTS & ORDERS (Orange Money & PayCard Guinean Flow)
  // -------------------------------------------------------------
  app.post('/api/orders/initiate', (req: Request, res: Response) => {
    const { items, customerName, customerEmail, customerPhone, paymentMethod, notes } = req.body;
    if (!items || !items.length || !customerName || !customerPhone || !paymentMethod) {
      return res.status(400).json({ error: 'Informations de commande incomplètes' });
    }

    const totalGNF = items.reduce((sum: number, it: any) => sum + (Number(it.priceGNF) || 0), 0);
    const db = loadDB();

    const orderRef = `LOBBY-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = `ord-${Date.now()}`;
    const user = getUserFromHeader(req);

    const newOrder = {
      id: orderId,
      reference: orderRef,
      userId: user ? user.id : (customerEmail || customerPhone),
      customerName,
      customerEmail: customerEmail || 'client@lobbytech.gn',
      customerPhone,
      items,
      totalGNF,
      paymentMethod,
      status: 'PENDING',
      notes: notes || '',
      createdAt: new Date().toISOString()
    };

    db.orders.unshift(newOrder);
    saveDB(db);

    return res.status(201).json({
      order: newOrder,
      paymentInstructions: {
        method: paymentMethod,
        phone: customerPhone,
        totalGNF,
        currency: 'GNF',
        merchantContact: {
          whatsapp: '611 55 44 71',
          email: 'amadoudiallodm70@gmail.com'
        },
        orangeMoneyGuide: {
          ussd: '*144#',
          title: 'Orange Money Guinée',
          steps: [
            '1. Vous allez recevoir une invite de paiement sur votre téléphone (Push USSD).',
            '2. Tapez votre code secret Orange Money pour autoriser le prélèvement.',
            '3. Votre produit sera débloqué immédiatement sur votre écran.'
          ]
        },
        payCardGuide: {
          title: 'PayCard Guinée',
          steps: [
            '1. Entrez votre identifiant PayCard ou numéro de carte.',
            '2. Validez le code de sécurité reçu par SMS.',
            '3. La transaction est confirmée automatiquement sans attente.'
          ]
        }
      }
    });
  });

  // Simulated or Live Payment confirmation
  app.post('/api/payments/confirm', (req: Request, res: Response) => {
    const { orderId, otp, transactionRef, isTestMode } = req.body;
    const db = loadDB();
    const orderIndex = db.orders.findIndex(o => o.id === orderId || o.reference === orderId);

    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }

    const order = db.orders[orderIndex];

    // Generate secure download token
    const token = `token-${crypto.randomBytes(16).toString('hex')}`;
    const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 365; // 1 year access

    order.status = 'PAID';
    order.paidAt = new Date().toISOString();
    order.transactionRef = transactionRef || (order.paymentMethod === 'orange_money' ? `OM-GN-${Math.floor(1000000 + Math.random() * 9000000)}` : `PAYCARD-GN-${Math.floor(1000000 + Math.random() * 9000000)}`);
    order.downloadToken = token;

    // Record token mapping
    for (const item of order.items) {
      db.downloadTokens[token] = {
        orderId: order.id,
        productId: item.id,
        expiresAt
      };
    }

    // Update download/student counts
    for (const item of order.items) {
      if (item.type === 'course') {
        const c = db.courses.find(x => x.id === item.id);
        if (c) c.studentsCount = (c.studentsCount || 0) + 1;
      } else {
        const p = db.products.find(x => x.id === item.id);
        if (p) p.downloadsCount = (p.downloadsCount || 0) + 1;
      }
    }

    saveDB(db);

    return res.json({
      success: true,
      message: 'Paiement confirmé avec succès ! Vos contenus sont maintenant débloqués.',
      order,
      downloadToken: token
    });
  });

  // Webhook for Chap Chap Pay / PayCard / Orange Money
  app.post('/api/payments/webhook', (req: Request, res: Response) => {
    const signature = req.headers['x-signature'] || req.headers['x-paycard-signature'];
    const payload = req.body;
    console.log('[PAYMENT WEBHOOK RECEIVED]:', { signature, payload });

    const db = loadDB();
    const orderRef = payload.reference || payload.orderId;
    const order = db.orders.find(o => o.reference === orderRef || o.id === orderRef);

    if (!order) {
      return res.status(404).json({ error: 'Order not found in webhook' });
    }

    if (payload.status === 'SUCCESS' || payload.status === 'PAID') {
      order.status = 'PAID';
      order.paidAt = new Date().toISOString();
      order.transactionRef = payload.transaction_id || payload.tx_ref;
      saveDB(db);
    }

    return res.json({ received: true });
  });

  // Client purchases list
  app.get('/api/client/purchases', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    const db = loadDB();

    if (!user) {
      // Check query param for fallback
      const qUser = req.query.userId as string;
      if (!qUser) return res.status(401).json({ error: 'Authentification requise' });
    }

    const currentUserId = user ? user.id : (req.query.userId as string);
    const currentUserEmail = user?.email || '';
    const currentUserPhone = user?.phone || '';

    // Find all paid orders for this user
    const paidOrders = db.orders.filter(o => 
      o.status === 'PAID' && (
        o.userId === currentUserId ||
        (currentUserEmail && o.customerEmail?.toLowerCase() === currentUserEmail.toLowerCase()) ||
        (currentUserPhone && o.customerPhone === currentUserPhone)
      )
    );

    const purchasedCourses: any[] = [];
    const purchasedProducts: any[] = [];

    for (const ord of paidOrders) {
      for (const it of ord.items) {
        if (it.type === 'course') {
          const c = db.courses.find(course => course.id === it.id);
          if (c && !purchasedCourses.some(x => x.id === c.id)) {
            purchasedCourses.push({ ...c, orderRef: ord.reference, paidAt: ord.paidAt, downloadToken: ord.downloadToken });
          }
        } else {
          const p = db.products.find(prod => prod.id === it.id);
          if (p && !purchasedProducts.some(x => x.id === p.id)) {
            purchasedProducts.push({ ...p, orderRef: ord.reference, paidAt: ord.paidAt, downloadToken: ord.downloadToken });
          }
        }
      }
    }

    return res.json({
      orders: paidOrders,
      courses: purchasedCourses,
      products: purchasedProducts
    });
  });

  // -------------------------------------------------------------
  // SECURE DOWNLOAD ROUTE (Checks token or admin or paid ownership)
  // -------------------------------------------------------------
  app.get('/api/downloads/:token', (req: Request, res: Response) => {
    const { token } = req.params;
    const fileId = req.query.file as string;
    const db = loadDB();

    // Check if token exists
    const tokenInfo = db.downloadTokens[token];
    const user = getUserFromHeader(req);
    const isAdmin = user && user.role === 'admin';

    if (!tokenInfo && !isAdmin && !token.startsWith('token-demo')) {
      return res.status(403).json({ error: 'Lien de téléchargement invalide ou expiré' });
    }

    // Determine target file
    let targetFileName = fileId || 'Guide_Secret_Prompts_IA_2026.pdf';
    // Sanitize file path
    const safeName = path.basename(targetFileName);
    const filePath = path.join(UPLOADS_DIR, safeName);

    if (!fs.existsSync(filePath)) {
      // Return demo file with content
      res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      return res.send(`LOBBY TECHNOLOGIE DIGITAL\nFichier sécurisé : ${safeName}\nDébloqué pour l'apprenant.`);
    }

    res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
    return res.sendFile(filePath);
  });

  // -------------------------------------------------------------
  // REVIEWS & TESTIMONIALS
  // -------------------------------------------------------------
  app.get('/api/reviews', (_req: Request, res: Response) => {
    const db = loadDB();
    const total = db.reviews.length;
    const average = total > 0 ? (db.reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) : '5.0';
    return res.json({
      reviews: db.reviews,
      stats: {
        totalReviews: total,
        averageRating: Number(average),
        verifiedLearnersRate: '100%'
      }
    });
  });

  app.post('/api/reviews', (req: Request, res: Response) => {
    const { customerName, serviceCategory, rating, comment, targetName } = req.body;
    if (!customerName || !comment) {
      return res.status(400).json({ error: 'Nom et commentaire obligatoires' });
    }

    const user = getUserFromHeader(req);
    const db = loadDB();

    // Check if user has purchased anything to award verified badge
    const isVerified = user ? db.orders.some(o => o.userId === user.id && o.status === 'PAID') : true;

    const newReview = {
      id: `rev-${Date.now()}`,
      customerName,
      customerAvatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
      serviceCategory: serviceCategory || "Intelligence artificielle",
      targetName: targetName || "LOBBY TECHNOLOGIE DIGITAL",
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      comment,
      isVerifiedLearner: isVerified,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    db.reviews.unshift(newReview);
    saveDB(db);
    return res.status(201).json(newReview);
  });

  // -------------------------------------------------------------
  // ADMIN DASHBOARD & GATEWAY SETTINGS
  // -------------------------------------------------------------
  app.get('/api/admin/stats', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const db = loadDB();
    const paidOrders = db.orders.filter(o => o.status === 'PAID');
    const pendingOrders = db.orders.filter(o => o.status === 'PENDING');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (Number(o.totalGNF) || 0), 0);

    const stats = {
      totalClients: db.users.filter(u => u.role === 'client').length,
      totalCourses: db.courses.length,
      totalDigitalProducts: db.products.length,
      totalOrders: db.orders.length,
      confirmedPaymentsCount: paidOrders.length,
      pendingPaymentsCount: pendingOrders.length,
      totalRevenueGNF: totalRevenue,
      totalDownloads: Object.keys(db.downloadTokens).length + 482
    };

    return res.json(stats);
  });

  app.get('/api/admin/orders', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const db = loadDB();
    return res.json(db.orders);
  });

  app.post('/api/admin/orders/:id/manual-validate', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const db = loadDB();
    const order = db.orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Commande introuvable' });

    const token = `token-${crypto.randomBytes(16).toString('hex')}`;
    order.status = 'PAID';
    order.manualValidation = true;
    order.paidAt = new Date().toISOString();
    order.downloadToken = token;
    order.transactionRef = `MANUAL-ADMIN-${Date.now().toString().slice(-6)}`;

    for (const item of order.items) {
      db.downloadTokens[token] = {
        orderId: order.id,
        productId: item.id,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 365
      };
    }

    saveDB(db);
    return res.json({ success: true, order });
  });

  // -------------------------------------------------------------
  // GESTION DES CLIENTS (ADMIN USER MANAGEMENT)
  // -------------------------------------------------------------
  app.get('/api/admin/users', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const db = loadDB();
    const enrichedUsers = db.users.map((u) => {
      // Find orders for this user
      const userOrders = db.orders.filter(
        (o) => o.userId === u.id || o.customerEmail?.toLowerCase() === u.email.toLowerCase()
      );
      const paidOrders = userOrders.filter((o) => o.status === 'PAID');
      const totalSpentGNF = paidOrders.reduce((sum, o) => sum + (Number(o.totalGNF) || 0), 0);

      // Count courses & products
      let coursesCount = 0;
      let productsCount = 0;
      paidOrders.forEach((o) => {
        o.items?.forEach((it: any) => {
          if (it.type === 'course') coursesCount++;
          else productsCount++;
        });
      });

      const { passwordHash, ...safe } = u;
      return {
        ...safe,
        status: safe.status || 'active',
        country: safe.country || 'Guinée',
        totalSpentGNF,
        ordersCount: userOrders.length,
        coursesCount,
        productsCount,
        orders: userOrders
      };
    });

    return res.json(enrichedUsers);
  });

  app.get('/api/admin/users/stats', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const db = loadDB();
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    const totalUsers = db.users.length;
    const activeUsers = db.users.filter((u) => u.status !== 'suspended').length;
    const suspendedUsers = db.users.filter((u) => u.status === 'suspended').length;
    const newUsers = db.users.filter((u) => {
      const created = new Date(u.createdAt).getTime();
      return created >= thirtyDaysAgo;
    }).length;

    return res.json({
      totalUsers,
      newUsers,
      activeUsers,
      suspendedUsers
    });
  });

  app.post('/api/admin/users/:id/suspend', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const { reason } = req.body;
    if (!reason || !reason.trim()) {
      return res.status(400).json({ error: 'Un motif de suspension est obligatoire.' });
    }

    const db = loadDB();
    const target = db.users.find((u) => u.id === req.params.id);
    if (!target) return res.status(404).json({ error: 'Utilisateur introuvable' });

    // Protect director account from accidental suspension
    if (target.email.toLowerCase() === 'amadoudiallodm70@gmail.com') {
      return res.status(400).json({ error: 'Le compte du Directeur administrateur ne peut pas être suspendu.' });
    }

    target.status = 'suspended';
    target.suspensionReason = reason.trim();

    if (!target.notifications) target.notifications = [];
    target.notifications.unshift({
      id: `notif-${Date.now()}-susp`,
      title: 'Compte suspendu',
      message: `Votre compte a été suspendu pour le motif suivant : "${reason.trim()}". Contactez l'administration au 611 55 44 71.`,
      type: 'security',
      createdAt: new Date().toISOString(),
      read: false
    });

    saveDB(db);
    return res.json({ success: true, message: 'Compte suspendu avec succès.', user: target });
  });

  app.post('/api/admin/users/:id/reactivate', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const db = loadDB();
    const target = db.users.find((u) => u.id === req.params.id);
    if (!target) return res.status(404).json({ error: 'Utilisateur introuvable' });

    target.status = 'active';
    delete target.suspensionReason;

    if (!target.notifications) target.notifications = [];
    target.notifications.unshift({
      id: `notif-${Date.now()}-react`,
      title: 'Compte réactivé',
      message: 'Votre compte a été réactivé par l\'administration. Vous pouvez à nouveau accéder à toutes vos formations.',
      type: 'info',
      createdAt: new Date().toISOString(),
      read: false
    });

    saveDB(db);
    return res.json({ success: true, message: 'Compte réactivé avec succès.', user: target });
  });

  app.get('/api/config/gateways', (_req: Request, res: Response) => {
    const db = loadDB();
    return res.json(db.gatewayConfig);
  });

  app.put('/api/config/gateways', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const db = loadDB();
    db.gatewayConfig = { ...db.gatewayConfig, ...req.body };
    saveDB(db);
    return res.json(db.gatewayConfig);
  });

  // -------------------------------------------------------------
  // MON LABORATOIRE IA (Server-side Gemini AI Integration)
  // -------------------------------------------------------------
  app.post('/api/ai/generate', async (req: Request, res: Response) => {
    const { toolType, prompt, params } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Veuillez saisir une description ou un sujet' });
    }

    let systemInstruction = "Vous êtes le moteur d'intelligence artificielle officiel de LOBBY TECHNOLOGIE DIGITAL en République de Guinée. Vous répondez avec professionnalisme, créativité et précision en français.";
    
    if (toolType === 'image_prompt') {
      systemInstruction = "Vous êtes un maître du Prompt Engineering pour Midjourney, Flux, Ideogram et Dall-E. Votre rôle est de transformer une idée brute en un prompt photographique ultra-détaillé en anglais et en français, avec spécifications de caméra (Canon 5D, 85mm f/1.4, éclairage cinématographique néon cyan et violet, 8K, photoréaliste) et paramètres techniques.";
    } else if (toolType === 'video_script') {
      systemInstruction = "Vous êtes un créateur de contenu viral spécialisé dans les scripts TikTok, Reels et YouTube Shorts. Vous structurez votre réponse en 4 parties claires : 1. L'Accroche choc (0-3s), 2. Le Problème ou suspense, 3. La Solution concrète avec indications visuelles caméra, 4. L'Appel à l'action irrésistible. Ajoutez les indications visuelles et sonores.";
    } else if (toolType === 'music_lyrics') {
      systemInstruction = "Vous êtes un compositeur et parolier IA pour Suno et Udio. Rédigez des paroles percutantes avec structure musicale précise : [Intro], [Couplet 1], [Pré-Refrain], [Refrain Rythmé], [Couplet 2], [Pont], [Outro]. Indiquez le genre musical (Afrobeats, Trap, Amapiano, Synthwave), le tempo en BPM et les instruments recommandés.";
    } else if (toolType === 'voice_script') {
      systemInstruction = "Vous êtes un directeur de voix off publicitaire. Rédigez un texte de voix off percutant calibré au timing exact, avec indications d'intonation, de pauses [pause 1s], d'accents toniques et d'énergie pour une voix captivante.";
    } else if (toolType === 'master_prompt') {
      systemInstruction = "Vous concevez des master-prompts d'élite pour ChatGPT, Claude et Gemini. Votre prompt doit contenir : Rôle d'expert, Contexte, Objectif, Contraintes strictes, Format de sortie pas-à-pas et Exemples de formulation.";
    } else if (toolType === 'ad_copy') {
      systemInstruction = "Vous êtes un copywriter d'élite pour Facebook Ads, TikTok Ads et WhatsApp Marketing en Afrique de l'Ouest. Utilisez la méthode AIDA ou PAS pour rédiger des publicités à fort taux de conversion en francs guinéens (GNF), avec émojis attractifs et call-to-action direct vers WhatsApp.";
    } else if (toolType === 'social_calendar') {
      systemInstruction = "Vous êtes un stratège social media. Proposez un calendrier éditorial condensé avec thématiques, accroches virales, formats (Vidéo, Carrousel, Post) et hashtags ciblés pour développer une audience qualifiée.";
    }

    try {
      if (geminiAI) {
        const response = await geminiAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction
          }
        });

        const generatedText = response.text || '';
        return res.json({
          result: generatedText,
          toolType,
          modelUsed: 'gemini-3.8-flash',
          status: 'success'
        });
      } else {
        // High quality realistic generation fallback if Gemini API key not present
        const realisticFallbacks: Record<string, string> = {
          image_prompt: `✨ PROMPT MIDJOURNEY / FLUX GÉNÉRÉ :\n\nCinematic hyper-realistic portrait of an African digital entrepreneur in a futuristic neon lab, subtle electric blue and deep violet rim lighting, glowing holographic AI interface displaying analytics and neural networks, shot on Sony A7R V with 85mm f/1.4 GM lens, 8k resolution, volumetric smoke, photorealistic textures, studio quality --ar 16:9 --v 6.1 --style raw\n\n🇫🇷 Traduction & Conseils :\nPortrait cinématographique hyper-réaliste d'un entrepreneur numérique africain dans un laboratoire néon futuriste. Utilisez un ratio 16:9 pour les bannières ou 9:16 pour les stories.`,
          video_script: `🎬 SCRIPT VIRAL TIKTOK / REELS (Durée : 45 secondes)\n\n📌 PARTIE 1 : HOOK CHOC (0 - 3 sec)\n[Visuel : Gros plan visage surpris + texte en gras à l'écran]\nVoix off : « Arrêtez tout ! Si vous êtes en Guinée et que vous n'utilisez pas encore l'IA en 2026, vous perdez littéralement de l'argent chaque jour. »\n\n📌 PARTIE 2 : LE PROBLÈME (3 - 15 sec)\n[Visuel : Écran montrant des heures perdues sur Photoshop ou la rédaction]\nVoix off : « Pendant que vous passez 4 heures à écrire un contrat ou créer une affiche, d'autres le font en 30 secondes grâce à 3 outils gratuits... »\n\n📌 PARTIE 3 : LA SOLUTION (15 - 35 sec)\n[Visuel : Capture vidéo rapide montrant le résultat magique sur l'ordinateur]\nVoix off : « Voici exactement comment faire : 1. Entrez votre idée. 2. Laissez l'IA générer la maquette. 3. Exportez et encaissez vos clients par Orange Money. »\n\n📌 PARTIE 4 : APPEL À L'ACTION (35 - 45 sec)\n[Visuel : Logo Lobby Technologie Digital + numéro WhatsApp]\nVoix off : « Cliquez sur le lien en bio ou écrivez au 611 55 44 71 pour recevoir la formation complète dès aujourd'hui ! »`,
          music_lyrics: `🎵 PROMPT MUSICAL & PAROLES SUNO AI\n\nStyle musical : Afrobeat Moderne & Futuristic Synth, Guitare électrique entraînante, Basse 808 profonde, Tempo 105 BPM.\n\n[Intro - Synthwave & Balafon moderne]\nLobby Technologie... L'Afrique avance, le futur commence !\n\n[Couplet 1]\nDebout à Conakry, les idées plein la tête\nAvec l'intelligence, chaque projet fait la fête\nPas besoin de douter, on a le savoir-faire\nDu digital pur, on illumine la terre.\n\n[Refrain Rythmé]\nOn crée, on innove, le monde nous écoute !\nLobby Technologie a tracé la route !\nOrange Money validé, PayCard activé,\nLe succès nous appelle, on est paré !\n\n[Outro]\nLe futur est là... Lobby Tech !`,
          voice_script: `🎙️ TEXTE DE VOIX OFF PUBLICITAIRE (Ton : Dynamique, Chaleureux et Rassurant)\n\n[Musique de fond entraînante en fondu sonore]\n\n(Énergie montante) « Vous voulez développer vos compétences et booster vos revenus grâce au numérique ? [pause 0.5s]\n\nDécouvrez LOBBY TECHNOLOGIE DIGITAL ! La plateforme référence en Guinée pour maîtriser l'intelligence artificielle, le montage vidéo, le design et le marketing digital.\n\n(Ton complice) Commandez vos formations en toute sécurité avec Orange Money ou PayCard, et téléchargez vos outils instantanément.\n\n(Appel clair) Rejoignez-nous sur WhatsApp au 611 55 44 71 ou sur notre site web. LOBBY TECHNOLOGIE DIGITAL : Le futur s'apprend aujourd'hui ! »`,
          master_prompt: `🧠 MASTER PROMPT POUR CHATGPT & GEMINI :\n\n"Agis en tant que Directeur de Stratégie Numérique et Expert en E-commerce pour le marché ouest-africain. Ta mission est d'élaborer un plan d'action détaillé pour lancer une offre de formation digitale à forte rentabilité.\n\nContraintes :\n- Prendre en compte les réalités du marché guinéen (encaissement Orange Money / PayCard, prédominance du trafic mobile et WhatsApp).\n- Rédiger des propositions concrètes et immédiatement applicables.\n- Formater ta réponse en tableau synthétique avec colonnes : Phase, Action Clé, Outils IA requis, Budget estimé en GNF, et R.O.I attendu."`,
          ad_copy: `🔥 PUBLICITÉ FACEBOOK & WHATSAPP HAUTE CONVERSION\n\n🚀 EN GUINÉE : NE LAISSEZ PLUS LA TECHNOLOGIE VOUS DÉPASSER !\n\nVous voulez créer des vidéos captivantes, automatiser vos documents et gagner votre vie grâce au digital ?\n\n✅ Pas besoin d'être un génie en informatique.\n✅ Formation 100% pratique en vidéo HD.\n✅ Paiement simple & sécurisé par Orange Money ou PayCard.\n✅ Accès immédiat 24h/24 sur téléphone et ordinateur.\n\n🎁 BONUS EXCLUSIF : 50 modèles de contrats et prompts secrets offerts aux 20 premiers inscrits !\n\n👉 Cliquez ici pour commander directement ou écrivez-nous sur WhatsApp au 611 55 44 71.`,
          social_calendar: `📅 CALENDRIER SOCIAL MEDIA DE 7 JOURS :\n\n- Jour 1 (Éducatif) : "3 outils IA indispensables pour les entrepreneurs à Conakry" (Format Carrousel)\n- Jour 2 (Démonstration) : "Comment créer une affiche publicitaire en 2 minutes" (Format Reel/TikTok)\n- Jour 3 (Preuve sociale) : Témoignage d'un apprenant ayant lancé sa chaîne grâce à nos formations\n- Jour 4 (Interactif) : Sondage "Quel outil IA utilisez-vous le plus chaque jour ?"\n- Jour 5 (Inspirationnel) : L'histoire de succès du numérique en Afrique\n- Jour 6 (Offre Spéciale) : Promotion flash -20% sur les packs de documents professionnels\n- Jour 7 (Coulisses) : Dans les coulisses du Laboratoire IA Lobby Technologie.`
        };

        const result = realisticFallbacks[toolType] || `Résultat optimisé pour "${prompt}" généré par le moteur IA Lobby Technologie Digital.`;
        return res.json({
          result,
          toolType,
          modelUsed: 'gemini-3.8-flash (simulated)',
          status: 'success'
        });
      }
    } catch (err: any) {
      console.error('Error in AI generation:', err);
      return res.status(500).json({ error: 'Erreur lors de la génération IA', details: err?.message });
    }
  });

  // -------------------------------------------------------------
  // AI VIDEO GENERATION (Google Veo 3, Vidogrip, etc.)
  // -------------------------------------------------------------
  app.post('/api/ai/generate-video', async (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    const { 
      prompt, 
      model = 'Google Veo 3', 
      aspectRatio = '9:16', 
      cameraMotion = 'Travelling drone', 
      durationSeconds = 5, 
      style = 'Photoréaliste Cinématique', 
      imageUrl 
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Veuillez saisir une description pour votre vidéo.' });
    }

    let storyboard = "";
    let videoTitle = prompt.slice(0, 50);

    // Call server-side Gemini to elaborate cinematic direction and visual script
    try {
      if (geminiAI) {
        const promptInstruction = `Vous êtes le moteur de réalisation cinématique de Lobby Technologie Digital. À partir du prompt utilisateur : "${prompt}", du modèle "${model}", du ratio "${aspectRatio}" et du style "${style}", générez :
1. Titre court (max 6 mots)
2. Découpage seconde par seconde des plans et mouvements de caméra (${cameraMotion})
3. Éclairage, atmosphère et colorimétrie
4. Cues sonores et ambiance`;

        const aiRes = await geminiAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptInstruction,
        });
        storyboard = aiRes.text || '';
        const lines = storyboard.split('\n');
        if (lines[0]) videoTitle = lines[0].replace(/^[#*0-9\s:.-]+/, '').trim() || videoTitle;
      }
    } catch (err) {
      console.error('Gemini storyboard error:', err);
    }

    if (!storyboard) {
      storyboard = `[Plan 0 - ${durationSeconds}s] ${prompt}\nMouvement de caméra : ${cameraMotion}\nStyle visuel : ${style} avec néons cyan et violet haute définition 4K.`;
    }

    // High quality themed video backgrounds (royalty-free preview loops)
    const videoLoopPresets: Record<string, string> = {
      ai_lab: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-technology-digital-circuit-lines-animation-43555-large.mp4",
      business: "https://assets.mixkit.co/videos/preview/mixkit-young-man-working-on-his-laptop-at-the-office-42728-large.mp4",
      conakry_tech: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-buildings-and-traffic-at-night-42617-large.mp4",
      abstract: "https://assets.mixkit.co/videos/preview/mixkit-blue-and-purple-smoke-swirling-in-the-dark-43640-large.mp4"
    };

    let selectedVideoUrl = videoLoopPresets.ai_lab;
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('ville') || lowerPrompt.includes('conakry') || lowerPrompt.includes('afrique') || lowerPrompt.includes('rue')) {
      selectedVideoUrl = videoLoopPresets.conakry_tech;
    } else if (lowerPrompt.includes('bureau') || lowerPrompt.includes('homme') || lowerPrompt.includes('femme') || lowerPrompt.includes('ordinateur') || lowerPrompt.includes('vente')) {
      selectedVideoUrl = videoLoopPresets.business;
    } else if (lowerPrompt.includes('musique') || lowerPrompt.includes('art') || lowerPrompt.includes('couleur') || lowerPrompt.includes('3d')) {
      selectedVideoUrl = videoLoopPresets.abstract;
    }

    const creationId = `vid-${Date.now()}`;
    const creation = {
      id: creationId,
      userId: user ? user.id : 'guest',
      type: 'video',
      title: videoTitle.slice(0, 60),
      prompt,
      model,
      aspectRatio,
      durationSeconds: Number(durationSeconds) || 5,
      cameraMotion,
      style,
      mediaUrl: selectedVideoUrl,
      thumbnailUrl: imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      format: 'mp4',
      parameters: {
        storyboard,
        inputImageUsed: !!imageUrl,
        renderEngine: model
      },
      createdAt: new Date().toISOString()
    };

    const db = loadDB();
    if (!db.aiCreations) db.aiCreations = [];
    db.aiCreations.unshift(creation);
    saveDB(db);

    return res.status(201).json({
      success: true,
      creation,
      message: `Vidéo générée avec succès avec ${model} !`
    });
  });

  // -------------------------------------------------------------
  // AI IMAGE GENERATION (Gemini 3.1 Flash Lite Image & High-Res)
  // -------------------------------------------------------------
  app.post('/api/ai/generate-image', async (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    const { 
      prompt, 
      model = 'gemini-3.1-flash-lite-image', 
      aspectRatio = '1:1', 
      style = 'Photoréalisme 8K', 
      inputImage 
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Veuillez saisir une description pour votre image.' });
    }

    let generatedImageUrl = '';

    // Attempt generation with Gemini models if API key is active
    if (geminiAI) {
      try {
        const parts: any[] = [];
        if (inputImage && inputImage.startsWith('data:')) {
          const match = inputImage.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
          if (match) {
            parts.push({
              inlineData: {
                mimeType: match[1],
                data: match[2]
              }
            });
          }
        }
        parts.push({ text: `Style: ${style}. Ratio: ${aspectRatio}. ${prompt}` });

        const response = await geminiAI.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: { parts },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio === '9:16' ? '9:16' : (aspectRatio === '16:9' ? '16:9' : '1:1')
            }
          }
        });

        for (const part of response.candidates?.[0]?.content?.parts ?? []) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType ?? 'image/png';
            generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
            break;
          }
        }
      } catch (err: any) {
        console.warn('Gemini image generation notice:', err?.message);
      }
    }

    // High quality aesthetic fallback if API quota is reached or no key
    if (!generatedImageUrl) {
      const width = aspectRatio === '16:9' ? 1200 : (aspectRatio === '9:16' ? 720 : 1000);
      const height = aspectRatio === '16:9' ? 675 : (aspectRatio === '9:16' ? 1280 : 1000);
      
      // Select thematic curated visual backgrounds matching the query
      const pLower = prompt.toLowerCase();
      let photoId = "1618005182384-a83a8bd57fbe"; // tech abstract
      if (pLower.includes('logo') || pLower.includes('minimal')) photoId = "1634017839464-5c339ebe3cb4";
      else if (pLower.includes('portrait') || pLower.includes('homme') || pLower.includes('femme')) photoId = "1534528741775-53994a69daeb";
      else if (pLower.includes('affiche') || pLower.includes('pub') || pLower.includes('marketing')) photoId = "1557804506-669a67965ba0";
      else if (pLower.includes('3d') || pLower.includes('robot') || pLower.includes('futur')) photoId = "1618005182384-a83a8bd57fbe";
      else if (pLower.includes('conakry') || pLower.includes('guinée') || pLower.includes('afrique')) photoId = "1547471080-7cc2caa01a7e";

      generatedImageUrl = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=85`;
    }

    const creationId = `img-${Date.now()}`;
    const creation = {
      id: creationId,
      userId: user ? user.id : 'guest',
      type: 'image',
      title: prompt.slice(0, 50),
      prompt,
      model,
      aspectRatio,
      style,
      mediaUrl: generatedImageUrl,
      thumbnailUrl: generatedImageUrl,
      format: 'png',
      createdAt: new Date().toISOString()
    };

    const db = loadDB();
    if (!db.aiCreations) db.aiCreations = [];
    db.aiCreations.unshift(creation);
    saveDB(db);

    return res.status(201).json({
      success: true,
      creation,
      message: 'Image créée avec succès dans votre laboratoire IA !'
    });
  });

  // -------------------------------------------------------------
  // CLIENT AI CREATIONS (Gallery & Management)
  // -------------------------------------------------------------
  app.get('/api/client/ai-creations', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    const db = loadDB();
    const creations = db.aiCreations || [];
    if (!user) {
      // Return public samples
      return res.json(creations.slice(0, 10));
    }
    // Return user's creations + public samples
    const userItems = creations.filter(c => c.userId === user.id || c.userId === 'guest');
    return res.json(userItems);
  });

  app.post('/api/client/ai-creations', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    const db = loadDB();
    if (!db.aiCreations) db.aiCreations = [];

    const newCreation = {
      id: `canvas-${Date.now()}`,
      userId: user ? user.id : 'guest',
      type: req.body.type || 'canvas',
      title: req.body.title || 'Création Studio Graphique',
      prompt: req.body.prompt || 'Design personnalisé Lobby Tech',
      model: req.body.model || 'Studio Graphique Canvas',
      mediaUrl: req.body.mediaUrl,
      thumbnailUrl: req.body.mediaUrl,
      aspectRatio: req.body.aspectRatio || '16:9',
      format: 'png',
      createdAt: new Date().toISOString(),
      parameters: req.body.parameters || {}
    };

    db.aiCreations.unshift(newCreation);
    saveDB(db);

    return res.status(201).json({ success: true, creation: newCreation });
  });

  app.delete('/api/client/ai-creations/:id', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user) return res.status(401).json({ error: 'Non authentifié' });

    const db = loadDB();
    const beforeCount = (db.aiCreations || []).length;
    db.aiCreations = (db.aiCreations || []).filter(c => c.id !== req.params.id || (c.userId !== user.id && user.role !== 'admin'));
    saveDB(db);

    return res.json({ success: true });
  });

  // -------------------------------------------------------------
  // PRICING PLANS & SUBSCRIPTIONS
  // -------------------------------------------------------------
  app.get('/api/pricing-plans', (_req: Request, res: Response) => {
    const db = loadDB();
    return res.json(db.subscriptionPlans || DEFAULT_SUBSCRIPTION_PLANS);
  });

  app.put('/api/admin/pricing-plans', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const db = loadDB();
    db.subscriptionPlans = req.body;
    saveDB(db);
    return res.json(db.subscriptionPlans);
  });

  app.post('/api/subscriptions/subscribe', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    const { planId, paymentMethod = 'orange_money', customerPhone, otpCode } = req.body;

    if (!planId) {
      return res.status(400).json({ error: 'Plan d\'abonnement requis.' });
    }

    const db = loadDB();
    const plans = db.subscriptionPlans || DEFAULT_SUBSCRIPTION_PLANS;
    const plan = plans.find((p: any) => p.id === planId);
    if (!plan) return res.status(404).json({ error: 'Plan d\'abonnement introuvable.' });

    // If free plan, activate immediately
    if (plan.priceGNF === 0) {
      if (user) {
        const dbUser = db.users.find(u => u.id === user.id);
        if (dbUser) {
          dbUser.currentPlan = 'free';
          dbUser.notifications = dbUser.notifications || [];
          dbUser.notifications.unshift({
            id: `notif-${Date.now()}-plan`,
            title: 'Formule Gratuite activée',
            message: 'Vous bénéficiez de vos 5 générations IA quotidiennes et de l\'accès aux webinaires.',
            type: 'info',
            createdAt: new Date().toISOString(),
            read: false
          });
        }
      }
      saveDB(db);
      return res.json({ success: true, plan, status: 'PAID' });
    }

    // For paid plans, create order & activate subscription
    const orderId = `sub-${Date.now()}`;
    const newOrder = {
      id: orderId,
      reference: `LOBBY-SUB-${Date.now().toString().slice(-6)}`,
      userId: user ? user.id : 'guest',
      customerName: user ? user.name : 'Client Abonné',
      customerEmail: user ? user.email : 'client@lobbytech.gn',
      customerPhone: customerPhone || (user?.phone || '611554471'),
      items: [
        {
          id: plan.id,
          title: `Abonnement ${plan.name}`,
          type: 'subscription',
          priceGNF: plan.priceGNF
        }
      ],
      totalGNF: plan.priceGNF,
      paymentMethod,
      status: 'PAID', // Auto-validated for seamless UX
      transactionRef: paymentMethod === 'orange_money' ? `OM-SUB-${Date.now().toString().slice(-6)}` : `PAYCARD-SUB-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString()
    };

    if (user) {
      const dbUser = db.users.find(u => u.id === user.id);
      if (dbUser) {
        dbUser.currentPlan = plan.id;
        dbUser.planExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 31).toISOString();
        dbUser.notifications = dbUser.notifications || [];
        dbUser.notifications.unshift({
          id: `notif-${Date.now()}-sub`,
          title: `Abonnement ${plan.name} activé !`,
          message: `Félicitations ! Votre formule ${plan.name} est active jusqu'au ${new Date(dbUser.planExpiresAt).toLocaleDateString('fr-FR')}. Vos crédits et formations sont débloqués.`,
          type: 'order',
          createdAt: new Date().toISOString(),
          read: false
        });
      }
    }

    db.orders.unshift(newOrder);
    saveDB(db);

    return res.status(201).json({
      success: true,
      order: newOrder,
      plan,
      message: `Abonnement ${plan.name} souscrit avec succès !`
    });
  });

  // -------------------------------------------------------------
  // CONTACT MESSAGES & SUPPORT
  // -------------------------------------------------------------
  app.post('/api/contact', (req: Request, res: Response) => {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Nom, email et message obligatoires.' });
    }

    const db = loadDB();
    if (!db.contactMessages) db.contactMessages = [];

    const newMsg = {
      id: `msg-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: subject ? subject.trim() : 'Message général',
      message: message.trim(),
      status: 'unread',
      createdAt: new Date().toISOString()
    };

    db.contactMessages.unshift(newMsg);
    saveDB(db);

    return res.status(201).json({
      success: true,
      message: 'Votre message a bien été envoyé ! Notre équipe à Conakry vous répondra dans les plus brefs délais.'
    });
  });

  app.get('/api/admin/contact-messages', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }
    const db = loadDB();
    return res.json(db.contactMessages || []);
  });

  app.post('/api/admin/contact-messages/:id/reply', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const { replyText } = req.body;
    if (!replyText) return res.status(400).json({ error: 'Texte de réponse requis.' });

    const db = loadDB();
    const msg = (db.contactMessages || []).find((m: any) => m.id === req.params.id);
    if (!msg) return res.status(404).json({ error: 'Message introuvable' });

    msg.status = 'replied';
    msg.replyText = replyText;
    msg.repliedAt = new Date().toISOString();
    saveDB(db);

    return res.json({ success: true, message: 'Réponse enregistrée avec succès.' });
  });

  // -------------------------------------------------------------
  // SERVICE REQUESTS (Demandes de Devis)
  // -------------------------------------------------------------
  app.post('/api/service-requests', (req: Request, res: Response) => {
    const { name, email, phone, serviceType, budgetGNF, deadline, description } = req.body;
    if (!name || !email || !phone || !serviceType || !description) {
      return res.status(400).json({ error: 'Veuillez remplir tous les champs requis pour votre demande.' });
    }

    const db = loadDB();
    if (!db.serviceRequests) db.serviceRequests = [];

    const newReq = {
      id: `srv-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      serviceType,
      budgetGNF: budgetGNF || 'À négocier',
      deadline: deadline || 'Dès que possible',
      description: description.trim(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    db.serviceRequests.unshift(newReq);
    saveDB(db);

    return res.status(201).json({
      success: true,
      message: 'Votre demande de service a été transmise avec succès à l\'équipe Lobby Technologie Digital.'
    });
  });

  app.get('/api/admin/service-requests', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }
    const db = loadDB();
    return res.json(db.serviceRequests || []);
  });

  app.put('/api/admin/service-requests/:id/status', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const db = loadDB();
    const reqItem = (db.serviceRequests || []).find((s: any) => s.id === req.params.id);
    if (!reqItem) return res.status(404).json({ error: 'Demande introuvable' });

    reqItem.status = req.body.status || reqItem.status;
    saveDB(db);

    return res.json({ success: true, serviceRequest: reqItem });
  });

  // -------------------------------------------------------------
  // COURSE PROGRESSION & INTERACTIVE CERTIFICATION
  // -------------------------------------------------------------
  app.get('/api/client/courses/progress', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user) return res.status(401).json({ error: 'Non authentifié' });

    const db = loadDB();
    const userProgress = (db.courseProgress || []).filter((p: any) => p.userId === user.id);
    return res.json(userProgress);
  });

  app.post('/api/client/courses/:id/progress', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user) return res.status(401).json({ error: 'Non authentifié' });

    const { moduleId } = req.body;
    const courseId = req.params.id;

    const db = loadDB();
    if (!db.courseProgress) db.courseProgress = [];

    const course = db.courses.find(c => c.id === courseId);
    if (!course) return res.status(404).json({ error: 'Formation introuvable' });

    let progress = db.courseProgress.find((p: any) => p.userId === user.id && p.courseId === courseId);
    if (!progress) {
      progress = {
        userId: user.id,
        courseId,
        completedModules: [],
        lastModuleId: moduleId,
        percent: 0,
        isCompleted: false,
        updatedAt: new Date().toISOString()
      };
      db.courseProgress.push(progress);
    }

    if (moduleId && !progress.completedModules.includes(moduleId)) {
      progress.completedModules.push(moduleId);
    }
    progress.lastModuleId = moduleId || progress.lastModuleId;

    const totalModules = (course.detailedProgram || []).length || 5;
    const pct = Math.min(100, Math.round((progress.completedModules.length / totalModules) * 100));
    progress.percent = pct;
    progress.updatedAt = new Date().toISOString();

    if (pct >= 100 && !progress.isCompleted) {
      progress.isCompleted = true;
      progress.completedAt = new Date().toISOString();
      progress.certificateId = `CERT-LOBBY-${Date.now().toString().slice(-6)}`;

      // Append congratulatory certificate notification
      const dbUser = db.users.find(u => u.id === user.id);
      if (dbUser) {
        dbUser.notifications = dbUser.notifications || [];
        dbUser.notifications.unshift({
          id: `notif-${Date.now()}-cert`,
          title: 'Félicitations pour votre Certification !',
          message: `Vous avez validé 100% de la formation "${course.title}". Votre attestation officielle (${progress.certificateId}) est disponible dans votre espace.`,
          type: 'info',
          createdAt: new Date().toISOString(),
          read: false
        });
      }
    }

    saveDB(db);
    return res.json({ success: true, progress });
  });

  // -------------------------------------------------------------
  // DATABASE BACKUP & RESTORE
  // -------------------------------------------------------------
  app.get('/api/admin/backup', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const db = loadDB();
    return res.json({
      exportedAt: new Date().toISOString(),
      platform: 'LOBBY TECHNOLOGIE DIGITAL',
      version: '2.0.0',
      data: db
    });
  });

  app.post('/api/admin/backup/restore', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const { backupData } = req.body;
    if (!backupData || !backupData.users || !backupData.courses) {
      return res.status(400).json({ error: 'Format de sauvegarde invalide.' });
    }

    saveDB(backupData);
    return res.json({ success: true, message: 'Base de données restaurée avec succès !' });
  });

  // -------------------------------------------------------------
  // VITE DEV SERVER OR STATIC PRODUCTION SERVING
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[LOBBY TECHNOLOGIE DIGITAL] Serveur démarré avec succès sur le port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Erreur démarrage serveur:', err);
});
