export const getDateStatus = (expiryDate?: string) => {
  if (!expiryDate) return { color: 'text-gray-400', label: 'Not Set', daysRemaining: 0, severity: 'none' as const };
  const now = new Date();
  const expiry = new Date(expiryDate);
  
  // Set times to midnight for accurate day counting
  now.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { color: 'text-red-500', label: `Expired (${Math.abs(diffDays)} days ago)`, daysRemaining: diffDays, severity: 'red' as const };
  } else if (diffDays <= 30) {
    return { color: 'text-red-600', label: `Expiring soon - ${diffDays} days remaining`, daysRemaining: diffDays, severity: 'red' as const };
  } else if (diffDays <= 60) {
    return { color: 'text-orange-500', label: `Due soon - ${diffDays} days remaining`, daysRemaining: diffDays, severity: 'orange' as const };
  } else {
    return { color: 'text-green-500', label: `Valid - ${diffDays} days remaining`, daysRemaining: diffDays, severity: 'green' as const };
  }
};

export const getStatusBg = (severity: 'red' | 'orange' | 'green' | 'none') => {
  switch (severity) {
    case 'red': return 'bg-red-50 border-red-100';
    case 'orange': return 'bg-orange-50 border-orange-100';
    case 'green': return 'bg-green-50 border-green-100';
    default: return 'bg-gray-50 border-gray-100';
  }
};

export const getStatusColor = (severity: 'red' | 'orange' | 'green' | 'none') => {
  switch (severity) {
    case 'red': return 'text-red-600';
    case 'orange': return 'text-orange-600';
    case 'green': return 'text-green-600';
    default: return 'text-gray-400';
  }
};
