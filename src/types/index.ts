export type UserRole = 'client' | 'admin';
export type UserStatus = 'active' | 'suspended';
export type PlanTier = 'free' | 'premium' | 'expert';

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: 'welcome' | 'order' | 'security' | 'info';
  createdAt: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  role: UserRole;
  status: UserStatus;
  currentPlan?: PlanTier;
  planExpiresAt?: string;
  suspensionReason?: string;
  emailVerified?: boolean;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  notifications?: UserNotification[];
}

export interface AdminUserListItem extends User {
  totalSpentGNF: number;
  ordersCount: number;
  coursesCount: number;
  productsCount: number;
  orders?: Order[];
}

export interface AdminUserStats {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  suspendedUsers: number;
}

export type CategoryFormation =
  | "Intelligence artificielle"
  | "Création de vidéos avec l'IA"
  | "Création de musique avec l'IA"
  | "Informatique et bureautique"
  | "Photoshop et design graphique"
  | "Montage vidéo"
  | "Excel et Word"
  | "E-commerce"
  | "Marketing digital"
  | "Publicité Facebook et TikTok"
  | "Création de contenu"
  | "Développement web";

export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string; // 'video' | 'pdf' | 'doc' | 'zip' | 'software'
  url: string; // server relative path or token URL
  uploadedAt: string;
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  description?: string;
  videoUrl?: string;
  pdfUrl?: string;
  isFreePreview?: boolean;
}

export interface Course {
  id: string;
  title: string;
  category: CategoryFormation;
  description: string;
  detailedProgram: CourseModule[];
  priceGNF: number;
  originalPriceGNF?: number;
  coverImage: string;
  previewVideo?: string;
  previewText?: string;
  durationHours: number;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Tous niveaux';
  instructor: string;
  isPublished: boolean;
  attachedFiles: AttachedFile[];
  studentsCount: number;
  rating: number;
  certificateOffered?: boolean;
  createdAt: string;
}

export interface CourseProgress {
  userId: string;
  courseId: string;
  completedModules: string[];
  lastModuleId?: string;
  percent: number;
  isCompleted: boolean;
  completedAt?: string;
  certificateId?: string;
  updatedAt: string;
}

export type DigitalProductType =
  | 'ebook'
  | 'pdf'
  | 'template'
  | 'video_pack'
  | 'zip'
  | 'software'
  | 'guide';

export interface DigitalProduct {
  id: string;
  name: string;
  category: string;
  productType: DigitalProductType;
  description: string;
  priceGNF: number;
  originalPriceGNF?: number;
  coverImage: string;
  demoUrl?: string;
  previewExcerpt?: string;
  features: string[];
  attachedFiles: AttachedFile[];
  isPublished: boolean;
  isFree?: boolean;
  downloadsCount: number;
  createdAt: string;
}

export type PaymentMethod = 'orange_money' | 'paycard';

export type OrderStatus = 'PAID' | 'PENDING' | 'FAILED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  title: string;
  type: 'course' | 'digital_product' | 'subscription';
  priceGNF: number;
  coverImage?: string;
}

export interface Order {
  id: string;
  reference: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalGNF: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  transactionRef?: string;
  gatewayResponse?: any;
  downloadToken?: string;
  createdAt: string;
  paidAt?: string;
  manualValidation?: boolean;
}

export interface Review {
  id: string;
  userId?: string;
  customerName: string;
  customerAvatar?: string;
  serviceCategory: string;
  targetId?: string; // course or product ID
  targetName?: string;
  rating: number; // 1 to 5
  comment: string;
  isVerifiedLearner: boolean;
  createdAt: string;
}

export interface PaymentGatewayConfig {
  orangeMoney: {
    enabled: boolean;
    merchantCode: string;
    apiKeyConfigured: boolean;
    environment: 'test' | 'live';
    ussdDialCode: string; // e.g. *144#
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
}

export interface DashboardStats {
  totalClients: number;
  totalCourses: number;
  totalDigitalProducts: number;
  totalOrders: number;
  confirmedPaymentsCount: number;
  pendingPaymentsCount: number;
  totalRevenueGNF: number;
  totalDownloads: number;
  totalAiCreations?: number;
}

export type AICreationType = 'video' | 'image' | 'prompt' | 'canvas';

export interface AICreation {
  id: string;
  userId: string;
  type: AICreationType;
  title: string;
  prompt: string;
  model: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  aspectRatio: string;
  format?: string;
  durationSeconds?: number;
  parameters?: Record<string, any>;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  tagline: string;
  priceGNF: number;
  period: 'month' | 'year';
  highlighted?: boolean;
  features: string[];
  aiCreditsMonthly: number;
  coursesAccess: 'free_only' | 'standard' | 'all';
  supportLevel: 'community' | 'whatsapp_priority' | 'direct_coaching';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  replyText?: string;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  budgetGNF?: string;
  deadline?: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
}

