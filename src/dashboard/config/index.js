// ============================================
// CONFIGURATION EXPORTS
// ============================================

export { theme, withOpacity } from './theme';
export { appConfig } from './app';

// Re-export commonly used values for convenience
import { theme } from './theme';
import { appConfig } from './app';

export const API_URL = appConfig.api.baseUrl;
export const navItems = appConfig.navigation;
export const timeOptions = appConfig.timeOptions;
export const CLOUDINARY = appConfig.cloudinary;
