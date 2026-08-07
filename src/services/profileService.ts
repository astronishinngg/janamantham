export interface UserProfile {
  fullName: string;
  designation: string;
  department: string;
  organization: string;
  email: string;
  phone: string;
  officeAddress: string;
  bio: string;
  avatarUrl: string | null;
}

export interface SessionActivity {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  time: string;
  isCurrent: boolean;
}

export const profileService = {
  getProfile: async (): Promise<UserProfile> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          fullName: 'Arvind Sharma',
          designation: 'Nodal Officer',
          department: 'Grievance Redressal Cell',
          organization: 'Ministry of Electronics and IT',
          email: 'arvind.sharma@gov.in',
          phone: '9876543210',
          officeAddress: 'CGO Complex, Lodhi Road, New Delhi 110003',
          bio: 'Supervising AI integration for national grievance resolution workflows.',
          avatarUrl: null,
        });
      }, 800);
    });
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  },

  uploadProfileImage: async (fileBase64: string): Promise<{ url: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ url: fileBase64 }), 1200);
    });
  },

  changePassword: async (current: string, newPass: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (current !== 'SecureGov123!') reject(new Error('Invalid current password'));
        else resolve();
      }, 1500);
    });
  },

  sendOTP: async (email: string): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, 1500));
  },

  verifyOTP: async (email: string, otp: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (otp === '1234') resolve();
        else reject(new Error('Invalid OTP'));
      }, 1500);
    });
  },

  resetPasswordWithOTP: async (email: string, newPass: string): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, 1500));
  },

  getSessions: async (): Promise<SessionActivity[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 'sess-1', device: 'Windows PC', browser: 'Chrome 120', ipAddress: '164.100.158.12', location: 'New Delhi, India', time: 'Active Now', isCurrent: true },
          { id: 'sess-2', device: 'MacBook Pro', browser: 'Safari 17', ipAddress: '14.139.60.45', location: 'Bengaluru, India', time: 'Yesterday, 14:30 IST', isCurrent: false },
          { id: 'sess-3', device: 'iPhone 15', browser: 'Mobile Safari', ipAddress: '117.218.10.19', location: 'Mumbai, India', time: 'Aug 1, 2026', isCurrent: false },
        ]);
      }, 600);
    });
  },

  logoutOtherSessions: async (): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, 1200));
  },

  exportAccountData: async (): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, 2000));
  },

  deleteAccount: async (): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, 3000));
  }
};