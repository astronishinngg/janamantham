// STRICT NAMED EXPORT
export const policyService = {
  generatePolicyBrief: async (analysisId: string): Promise<{ briefId: string; status: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ briefId: `pb-${Date.now()}`, status: 'Generated' });
      }, 2000);
    });
  }
};