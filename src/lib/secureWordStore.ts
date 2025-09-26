interface SecureWordInfo {
  secureWord: string;
  issuedAt: number;
}

const secureWordStore = new Map<string, SecureWordInfo>();

export default secureWordStore;
