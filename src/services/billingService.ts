export interface SubscriptionInfo {
  isPro: boolean;
  trialEndsAt?: string;
  status: 'active' | 'trialing' | 'canceled' | 'none';
  plan: string;
}

export const ADMIN_EMAIL = 'harkeeratn02@gmail.com';

export const AIRCLASSPRO_PLANS = [
  {
    id: 'price_monthly',
    name: 'Cadet',
    price: 199,
    displayPrice: '199',
    interval: 'month',
    trialDays: 3,
    description: 'Perfect for student pilots'
  },
  {
    id: 'price_6months',
    name: 'Navigator',
    price: 799,
    displayPrice: '799',
    interval: '6 months',
    trialDays: 3,
    description: 'Popular choice',
    tag: 'Popular'
  },
  {
    id: 'price_yearly',
    name: 'Captain',
    price: 1999,
    displayPrice: '1999',
    interval: 'year',
    trialDays: 3,
    description: 'Best Value',
    tag: 'Best Value'
  }
];

class BillingService {
  private static instance: BillingService;
  private STORAGE_KEY = 'airclass_subscription';
  private subInfo: SubscriptionInfo = {
    isPro: false,
    status: 'none',
    plan: 'free'
  };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.subInfo = JSON.parse(saved);
    }
  }

  private saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.subInfo));
  }

  public static getInstance(): BillingService {
    if (!BillingService.instance) {
      BillingService.instance = new BillingService();
    }
    return BillingService.instance;
  }

  getSubscription(email?: string): SubscriptionInfo {
    if (email === ADMIN_EMAIL) {
      return {
        isPro: true,
        status: 'active',
        plan: 'admin_unlimited'
      };
    }
    return this.subInfo;
  }

  async startTrial(planId: string) {
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 3);
    
    this.subInfo = {
      isPro: true,
      status: 'trialing',
      plan: planId,
      trialEndsAt: trialEnd.toISOString()
    };
    this.saveToStorage();
    return true;
  }

  async startCheckoutSession(planId: string) {
    // Redirect to Razorpay subscription link for AirclassPRO
    window.location.href = 'https://razorpay.me/@harkeeratnain';
    return true;
  }

  async cancelSubscription() {
    this.subInfo = { isPro: false, status: 'none', plan: 'free' };
    this.saveToStorage();
  }
}

export const billingService = BillingService.getInstance();
