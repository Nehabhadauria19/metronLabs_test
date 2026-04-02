module.exports = {
  SECRET_PATTERNS: [
    /AKIA[0-9A-Z]{16}/, // AWS
    /AIza[0-9A-Za-z-_]{35}/, // Google API
    /sk_live_[0-9a-zA-Z]{24}/, // Stripe
    /password\s*=\s*["'].*["']/i,
    /token\s*=\s*["'].*["']/i,
  ],

  SENSITIVE_FILES: [
    ".env",
    ".pem",
    "id_rsa",
    "config.json",
    "secrets.yml",
  ],
};