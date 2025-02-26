export function generateOtpEmail(otp: string): string {
  return `
    <div style="
      font-family: Arial, sans-serif;
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 10px;
      border: 1px solid #e0e0e0;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
      text-align: center;
    ">
      <h2 style="color: #ff6600; margin-bottom: 15px;">Your One-Time Password (OTP)</h2>
      
      <p style="font-size: 16px; color: #333; margin-bottom: 10px;">
        Use the OTP below to complete your verification:
      </p>

      <div style="
        font-size: 24px;
        font-weight: bold;
        color: #ff6600;
        background: #fff4e6;
        padding: 12px 24px;
        display: inline-block;
        border-radius: 8px;
        margin: 10px 0;
      ">
        ${otp}
      </div>

      <p style="font-size: 14px; color: #666; margin-top: 10px;">
        Do not share this OTP with anyone. It will expire in <strong>2 minutes</strong>.
      </p>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

      <p style="font-size: 14px; color: #666;">Best regards,<br><strong>FTPL Team</strong></p>
    </div>
  `;
}

export function generateForgotPasswordEmail(
  name: string,
  userId: string,
): string {
  return `
    <div style="
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 24px;
      background-color: #ffffff;
      border-radius: 10px;
      border: 1px solid #e0e0e0;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
    ">
      <h2 style="
        color: #ff6600;
        text-align: center;
        margin-bottom: 20px;
      ">
        Password Reset Request
      </h2>

      <p style="font-size: 16px; color: #333; text-align: center;">
        Hi <strong>${name}</strong>,
      </p>

      <p style="font-size: 14px; color: #555; text-align: center; margin-bottom: 20px;">
        We received a request to reset your password. Click the button below to proceed:
      </p>

      <div style="text-align: center; margin: 25px 0;">
        <a href="${process.env.ENVIRONMENT == 'development' ? 'http://localhost:3000' : 'http://localhost:3000'}/forgot-password/${userId}"
          style="
            display: inline-block;
            padding: 14px 28px;
            background-color: #ff6600;
            color: #ffffff;
            text-decoration: none;
            font-size: 16px;
            font-weight: bold;
            border-radius: 6px;
            transition: background 0.3s ease-in-out;
          "
          onmouseover="this.style.backgroundColor='#e65c00';"
          onmouseout="this.style.backgroundColor='#ff6600';"
        >
          Reset Password
        </a>
      </div>

      <p style="font-size: 14px; color: #666; text-align: center;">
        If you did not request this, you can safely ignore this email.
      </p>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;">

      <p style="font-size: 14px; text-align: center; color: #666;">
        Best regards,<br>
        <strong>FTPL Team</strong>
      </p>
    </div>`;
}
