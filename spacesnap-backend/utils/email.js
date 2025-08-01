// utils/email.js
const config = require("../config/env");
const transporter = require("../config/email");

/**
 * Send email verification link with modern, responsive design
 * @param {Object} user - User object containing name and email
 * @param {string} token - Verification token
 */
const sendVerificationEmail = async (user, token) => {
  const verificationUrl = `${config.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"SpaceSnap Team" <${config.EMAIL_FROM}>`,
    to: user.email,
    subject: "🚀 Verify Your SpaceSnap Account",
    html: createVerificationEmailTemplate(user, verificationUrl),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to: ${user.email}`);
  } catch (error) {
    console.error(
      `❌ Failed to send verification email to ${user.email}:`,
      error
    );
    throw new Error("Failed to send verification email");
  }
};

/**
 * Send password reset email with secure token
 * @param {Object} user - User object containing name and email
 * @param {string} token - Password reset token
 */
const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"SpaceSnap Security" <${config.EMAIL_FROM}>`,
    to: user.email,
    subject: "🔐 Reset Your SpaceSnap Password",
    html: createPasswordResetTemplate(user, resetUrl),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to: ${user.email}`);
  } catch (error) {
    console.error(
      `❌ Failed to send password reset email to ${user.email}:`,
      error
    );
    throw new Error("Failed to send password reset email");
  }
};

/**
 * Create email verification template
 */
const createVerificationEmailTemplate = (user, verificationUrl) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - SpaceSnap</title>
        <style>
          @media only screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .content { padding: 20px !important; }
            .header { padding: 25px 20px 12px !important; }
            .button { padding: 14px 24px !important; font-size: 15px !important; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa; line-height: 1.6;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="min-height: 100vh;">
          <tr>
            <td align="center">
              
              <!-- Main Container -->
              <table class="container" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12); overflow: hidden;">
                
                <!-- Header -->
                <tr>
                  <td class="header" style="padding: 30px 30px 15px; text-align: center; background: #0d9488;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.8px;">
                      🚀 SpaceSnap
                    </h1>
                    <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 500;">
                      Interior Design Platform
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td class="content" style="padding: 35px 30px;">
                    
                    <!-- Icon Section -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 25px; text-align: center;">
                      <tr>
                        <td style="width: 80px; height: 80px; background: #0d9488; border-radius: 50%; text-align: center; vertical-align: middle; box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);">
                          <span style="font-size: 36px; line-height: 80px; display: inline-block; color: white;">✉️</span>
                        </td>
                      </tr>
                    </table>

                    <!-- Title & Subtitle -->
                    <div style="text-align: center; margin-bottom: 25px;">
                      <h2 style="margin: 0 0 10px; color: #2c3e50; font-size: 28px; font-weight: 600; line-height: 1.3;">
                        Verify Your Email
                      </h2>
                      <p style="margin: 0; color: #7f8c8d; font-size: 18px; line-height: 1.5;">
                        Welcome to SpaceSnap! Let's get you started.
                      </p>
                    </div>

                    <!-- Message Box -->
                    <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; padding: 25px; margin-bottom: 25px; border-left: 5px solid #0d9488;">
                      <p style="margin: 0 0 15px; color: #2c3e50; font-size: 16px; line-height: 1.6;">
                        Hi <strong style="color: #4CAF50;">${user.name}</strong>,
                      </p>
                      <p style="margin: 0; color: #2c3e50; font-size: 16px; line-height: 1.6;">
                        Thank you for joining SpaceSnap! To complete your registration and unlock amazing interior design features, please verify your email address.
                      </p>
                    </div>

                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${verificationUrl}" class="button" style="
                        display: inline-block;
                        background: #0d9488;
                        color: #ffffff;
                        text-decoration: none;
                        padding: 18px 36px;
                        border-radius: 12px;
                        font-size: 16px;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                        box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
                        transition: all 0.3s ease;
                        border: none;
                        cursor: pointer;
                      ">
                        ✅ Verify Email Address
                      </a>
                    </div>

                    <!-- Alternative Link -->
                    <div style="background-color: #f8f9fa; border-radius: 12px; padding: 20px; margin-top: 25px; border: 1px solid #e9ecef;">
                      <p style="margin: 0 0 10px; color: #6c757d; font-size: 14px; text-align: center; font-weight: 500;">
                        Button not working? Copy and paste this link:
                      </p>
                      <p style="margin: 0; word-break: break-all; color: #4CAF50; font-size: 13px; text-align: center; font-family: monospace; background: #fff; padding: 8px; border-radius: 6px; border: 1px solid #e9ecef;">
                        ${verificationUrl}
                      </p>
                    </div>

                    <!-- Security Notice -->
                    <div style="border-top: 2px solid #e9ecef; padding-top: 25px; margin-top: 30px;">
                      <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                        <p style="margin: 0; color: #856404; font-size: 14px; text-align: center;">
                          <strong>⚠️ Security Notice:</strong> This link expires in 1 hour for your protection.
                        </p>
                      </div>
                      <p style="margin: 0; color: #6c757d; font-size: 13px; text-align: center; line-height: 1.5;">
                        If you didn't create a SpaceSnap account, please ignore this email or contact our support team.
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 25px 30px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-top: 1px solid #dee2e6;">
                    <div style="text-align: center;">
                      <p style="margin: 0 0 8px; color: #6c757d; font-size: 14px; font-weight: 500;">
                        Thank you for choosing SpaceSnap
                      </p>
                      <p style="margin: 0 0 15px; color: #adb5bd; font-size: 12px;">
                        © 2025 SpaceSnap. All rights reserved.
                      </p>
                      <div style="border-top: 1px solid #dee2e6; padding-top: 15px;">
                        <p style="margin: 0; color: #adb5bd; font-size: 11px;">
                          SpaceSnap Inc. | Interior Design Platform<br>
                          This email was sent to ${user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

/**
 * Create password reset email template
 */
const createPasswordResetTemplate = (user, resetUrl) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - SpaceSnap</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td align="center">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);">
                
                <!-- Header -->
                <tr>
                  <td style="padding: 30px 30px 15px; text-align: center; background: #0d9488; border-radius: 16px 16px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">
                      🔐 SpaceSnap
                    </h1>
                    <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">
                      Password Reset Request
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 35px 30px;">

                     <!-- Icon Section -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 25px; text-align: center;">
                      <tr>
                        <td style="width: 80px; height: 80px; background: #0d9488; border-radius: 50%; text-align: center; vertical-align: middle; box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);">
                          <span style="font-size: 36px; line-height: 80px; display: inline-block; color: white;">🔑</span>
                        </td>
                      </tr>
                    </table>

                    <!-- Title & Subtitle -->
                    <div style="text-align: center; margin-bottom: 25px;">
                      <h2 style="margin: 0 0 10px; color: #2c3e50; font-size: 28px; font-weight: 600; line-height: 1.3;">
                       Reset Your Password
                      </h2>
                    </div>

                    <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 25px; border-left: 5px solid #0d9488;">
                      <p style="margin: 0 0 15px; color: #2c3e50; font-size: 16px;">
                        Hi <strong>${user.name}</strong>,
                      </p>
                      <p style="margin: 0; color: #2c3e50; font-size: 16px;">
                        We received a request to reset your SpaceSnap password. Click the button below to create a new password:
                      </p>
                    </div>

                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${resetUrl}" style="
                        display: inline-block;
                        background: #0d9488;
                        color: #ffffff;
                        text-decoration: none;
                        padding: 18px 36px;
                        border-radius: 12px;
                        font-size: 16px;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                        box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
                      ">
                        🔑 Reset Password
                      </a>
                    </div>

                    <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 25px 0;">
                      <p style="margin: 0 0 10px; color: #856404; font-size: 14px; text-align: center;">
                        <strong>⚠️ Important:</strong> This reset link expires in 1 hour.
                      </p>
                      <p style="margin: 0; color: #856404; font-size: 14px; text-align: center;">
                        If you didn't request this reset, please ignore this email and your password will remain unchanged.
                      </p>
                    </div>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 25px 30px; background-color: #f8f9fa; border-radius: 0 0 16px 16px;">
                    <p style="margin: 0; color: #6c757d; font-size: 14px; text-align: center;">
                      © 2025 SpaceSnap. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};


module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
