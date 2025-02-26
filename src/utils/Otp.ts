import * as crypto from 'crypto';

// Assuming generateOtp is defined elsewhere
function generateOtp(): number {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
}

// Function to ensure the secret key is 32 bytes (via SHA-256)
function get32ByteKey(secretKey: string): Buffer {
  return crypto.createHash('sha256').update(secretKey).digest(); // Generates a 32-byte hash
}

// Function to encrypt OTP
export const encryptedOTP = (): { otp: string; encryptedOTP: string } => {
  const otp = generateOtp();
  const secretKey = process.env.OTP_ENCRYPTION as string; // Secret key (can be any length)
  const iv = crypto.randomBytes(16); // Initialization vector (IV) of 16 bytes

  // Ensure the key is exactly 32 bytes long using SHA-256
  const key = get32ByteKey(secretKey);

  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    key, // 32-byte key
    iv, // 16-byte IV
  );

  let encrypted = cipher.update(otp.toString(), 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Combine IV and encrypted OTP (to be sent to the frontend)
  const encryptedOTP = iv.toString('hex') + ':' + encrypted;

  return { otp: otp.toString(), encryptedOTP }; // Return OTP and its encrypted version
};
