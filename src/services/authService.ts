import { userService } from './userService';

export type AuthChangeListener = (user: any | null) => void;
let listeners: AuthChangeListener[] = [];

export const authService = {
  subscribeToAuthChanges(callback: AuthChangeListener) {
    listeners.push(callback);
    // Immediately check if user exists
    userService.getUserProfile().then(profile => {
      callback(profile ? { uid: 'local-user', ...profile } : null);
    });
    
    return () => {
      listeners = listeners.filter(l => l !== callback);
    };
  },

  async login(name: string, email: string, phoneNumber?: string, city?: string) {
    const profile = await userService.createUserProfile(name, email, phoneNumber, city);
    this.notifyListeners(profile);
    return profile;
  },

  async logout() {
    localStorage.removeItem('airclasspro_user_profile');
    this.notifyListeners(null);
  },

  notifyListeners(user: any | null) {
    listeners.forEach(callback => callback(user));
  }
};
