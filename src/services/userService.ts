import { UserProfile } from '../types';

const STORAGE_KEY = 'airclasspro_user_profile';
const SESSIONS_KEY = 'airclasspro_sessions';
const BOOKMARKS_KEY = 'airclasspro_bookmarks';

export const userService = {
  async createUserProfile(name: string, email: string, phoneNumber?: string, city?: string): Promise<UserProfile> {
    const studentId = `ACP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const validUntil = new Date();
    validUntil.setMonth(now.getMonth() + 1);

    const profile: UserProfile = {
      uid: 'local-user',
      email,
      name,
      studentId,
      createdAt: now.toISOString(),
      lastLogin: now.toISOString(),
      isBanned: false,
      planId: 'free',
      subscriptionStatus: 'inactive',
      streak: 0,
      readinessScore: 0,
      licenseType: 'Student Pilot',
      validFrom: now.toISOString(),
      validUntil: validUntil.toISOString(),
      medicalExpiry: '',
      flightReviewDate: '',
      licenseExpiry: '',
      bfrDueDate: '',
      // Custom fields from the request
      phoneNumber,
      city
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    return profile;
  },

  async getUserProfile(): Promise<UserProfile | null> {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  async updateProfile(data: Partial<UserProfile>) {
    const current = await this.getUserProfile();
    if (current) {
      const updated = { ...current, ...data, lastLogin: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    }
    return null;
  },

  async saveSession(uid: string, data: any) {
    const sessions = JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
    sessions.unshift({
      ...data,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions.slice(0, 50)));
  },

  async getSessions(uid: string, limitCount = 10) {
    const sessions = JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
    return sessions.slice(0, limitCount);
  },

  async toggleBookmark(uid: string, content: any) {
    const bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]');
    const index = bookmarks.findIndex((b: any) => b.id === content.id);
    
    if (index > -1) {
      bookmarks.splice(index, 1);
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
      return false;
    } else {
      bookmarks.unshift({
        ...content,
        savedAt: new Date().toISOString()
      });
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
      return true;
    }
  },

  async getBookmarks(uid: string) {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]');
  },

  async isAdmin(email: string) {
    return email === 'harkeeratn02@gmail.com';
  }
};
