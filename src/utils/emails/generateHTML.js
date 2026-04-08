export const signUp = (userName, activationUrl) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Activate Your Account</title>
        <style>
            /* Base styles */
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
            
            /* Table-based layout for better email client support */
            .email-container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #f4f4f4;
            }
            
            .email-content {
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            
            .header {
                background-color: #4CAF50;
                color: white;
                text-align: center;
                padding: 30px 20px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .button {
                display: inline-block;
                background-color: #4CAF50;
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
                font-size: 16px;
                text-align: center;
                margin: 20px 0;
                min-width: 200px;
            }
            
            .button:hover {
                background-color: #45a049;
            }
            
            .footer {
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 12px;
                border-top: 1px solid #eee;
                background-color: #f9f9f9;
            }
            
            .warning {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
                padding: 15px;
                border-radius: 4px;
                margin: 20px 0;
            }
            
            .link-container {
                background-color: #f8f9fa;
                padding: 15px;
                border-radius: 4px;
                margin: 15px 0;
                word-break: break-all;
                font-family: monospace;
                font-size: 14px;
            }
            
            /* Mobile responsive styles */
            @media only screen and (max-width: 600px) {
                .email-container {
                    width: 100% !important;
                }
                
                .header {
                    padding: 20px 15px !important;
                }
                
                .header h1 {
                    font-size: 24px !important;
                }
                
                .content {
                    padding: 20px 15px !important;
                }
                
                .content h2 {
                    font-size: 20px !important;
                }
                
                .button {
                    display: block !important;
                    width: 100% !important;
                    box-sizing: border-box !important;
                    padding: 15px !important;
                }
                
                .warning {
                    padding: 12px !important;
                }
                
                .link-container {
                    padding: 12px !important;
                    font-size: 12px !important;
                }
            }
            
            /* Desktop specific styles */
            @media only screen and (min-width: 601px) {
                .email-container {
                    width: 600px !important;
                }
            }
        </style>
    </head>
    <body>
        <table class="email-container" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td>
                    <table class="email-content" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <!-- Header -->
                        <tr>
                            <td class="header">
                                <h1 style="margin: 0; font-size: 28px;">Welcome to Saraha Application!</h1>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td class="content">
                                <h2 style="margin-top: 0; color: #333;">Hello ${userName},</h2>
                                <p style="margin-bottom: 20px;">Thank you for registering with Saraha Application! To complete your registration and activate your account, please click the button below:</p>
                                
                                <div style="text-align: center;">
                                    <a href="${activationUrl}" class="button">Activate My Account</a>
                                </div>
                                
                                <p style="margin: 20px 0 10px 0;">If the button doesn't work, you can also copy and paste this link into your browser:</p>
                                <div class="link-container">
                                    ${activationUrl}
                                </div>
                                
                                <div class="warning">
                                    <strong>Important:</strong> This activation link will expire in 24 hours for security reasons. If you didn't create this account, please ignore this email.
                                </div>
                                
                                <p style="margin-bottom: 20px;">If you have any questions, feel free to contact our support team.</p>
                                
                                <p style="margin-bottom: 0;">Best regards,<br><strong>The Saraha Application Team</strong></p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td class="footer">
                                <p style="margin: 0 0 10px 0;">This is an automated email. Please do not reply to this message.</p>
                                <p style="margin: 0;">&copy; 2024 Saraha Application. All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;
export const verifyOTP = (userName, otp) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Account - OTP</title>
        <style>
            /* Base styles */
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
            
            .email-container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #f4f4f4;
            }
            
            .email-content {
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            
            .header {
                background-color: #2196F3;
                color: white;
                text-align: center;
                padding: 30px 20px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .otp-box {
                background-color: #f0f7ff;
                border: 2px solid #2196F3;
                border-radius: 8px;
                padding: 25px;
                text-align: center;
                margin: 20px 0;
            }
            
            .otp-code {
                font-size: 36px;
                font-weight: bold;
                color: #2196F3;
                letter-spacing: 5px;
                font-family: 'Courier New', monospace;
                margin: 10px 0;
            }
            
            .footer {
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 12px;
                border-top: 1px solid #eee;
                background-color: #f9f9f9;
            }
            
            .warning {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
                padding: 15px;
                border-radius: 4px;
                margin: 20px 0;
            }
            
            .info-box {
                background-color: #e3f2fd;
                border-left: 4px solid #2196F3;
                padding: 15px;
                margin: 15px 0;
            }
            
            @media only screen and (max-width: 600px) {
                .email-container {
                    width: 100% !important;
                }
                
                .header {
                    padding: 20px 15px !important;
                }
                
                .header h1 {
                    font-size: 24px !important;
                }
                
                .content {
                    padding: 20px 15px !important;
                }
                
                .otp-code {
                    font-size: 28px !important;
                    letter-spacing: 3px !important;
                }
                
                .warning {
                    padding: 12px !important;
                }
            }
        </style>
    </head>
    <body>
        <table class="email-container" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td>
                    <table class="email-content" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <!-- Header -->
                        <tr>
                            <td class="header">
                                <h1 style="margin: 0; font-size: 28px;">Account Verification</h1>
                                <p style="margin: 10px 0 0 0; font-size: 16px;">Verify Your Email Address</p>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td class="content">
                                <h2 style="margin-top: 0; color: #333;">Hello ${userName},</h2>
                                <p style="margin-bottom: 15px;">Thank you for registering! To complete your account verification, please use the following One-Time Password (OTP):</p>
                                
                                <div class="otp-box">
                                    <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your OTP Code:</p>
                                    <div class="otp-code">${otp}</div>
                                </div>
                                
                                <div class="info-box">
                                    <p style="margin: 0;"><strong>How to use:</strong> Copy the OTP code above and paste it into the verification field on our website to complete your account setup.</p>
                                </div>
                                
                                <div class="warning">
                                    <strong>⚠️ Security Notice:</strong> 
                                    <ul style="margin: 10px 0; padding-left: 20px;">
                                        <li>Never share this OTP with anyone</li>
                                        <li>Our team will never ask you for this code</li>
                                        <li>If you didn't request this code, please ignore this email</li>
                                    </ul>
                                </div>
                                
                                <p style="margin-bottom: 20px;">If you experience any issues or didn't request this verification code, please contact our support team immediately.</p>
                                
                                <p style="margin-bottom: 0;">Best regards,<br><strong>The Saraha Application Team</strong></p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td class="footer">
                                <p style="margin: 0 0 10px 0;">This is an automated email. Please do not reply to this message.</p>
                                <p style="margin: 0;">&copy; 2024 Saraha Application. All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
`;
export const verifyNewEmail = (userName, verificationUrl) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Confirm Your New Email</title>
    <style>
      body { font-family: Arial, sans-serif; margin:0; padding:0; background:#f4f4f4; color:#333; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
      .email-container { width:100%; max-width:600px; margin:0 auto; background:#f4f4f4; }
      .email-content { background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 0 10px rgba(0,0,0,0.06); }
      .header { background:#6a5acd; color:#fff; text-align:center; padding:28px 20px; }
      .content { padding:28px 20px; }
      .button { display:inline-block; background:#6a5acd; color:#fff; padding:14px 28px; text-decoration:none; border-radius:6px; font-weight:600; font-size:16px; margin:16px 0; }
      .link-container { background:#f8f9fb; padding:12px; border-radius:6px; word-break:break-all; font-family:monospace; font-size:14px; margin:12px 0; }
      .notice { background:#e9f5ff; border-left:4px solid #6a5acd; padding:12px; border-radius:4px; margin:12px 0; color:#234; }
      .footer { text-align:center; padding:18px; color:#777; font-size:13px; border-top:1px solid #eee; background:#fafafa; }

      @media only screen and (max-width:600px) {
        .header { padding:20px 16px; }
        .content { padding:20px 16px; }
        .button { display:block; width:100%; box-sizing:border-box; text-align:center; padding:14px; }
        .link-container { font-size:13px; padding:10px; }
      }
      @media only screen and (min-width:601px) {
        .email-container { width:600px !important; }
      }
    </style>
  </head>
  <body>
    <table class="email-container" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td>
          <table class="email-content" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td class="header">
                <h1 style="margin:0; font-size:22px;">Confirm Your New Email Address</h1>
              </td>
            </tr>

            <tr>
              <td class="content">
                <h2 style="margin:0 0 10px 0; font-size:18px;">Hello ${userName || "User"},</h2>
                <p style="margin:0 0 16px 0; color:#555;">We received a request to use this email for your account. Click the button below to confirm and complete the change.</p>

                <div style="text-align:center;">
                  <a href="${verificationUrl}" class="button">Confirm New Email</a>
                </div>

                <p style="margin:16px 0 8px 0; color:#666;">If the button doesn't work, copy and paste the link below into your browser:</p>
                <div class="link-container">${verificationUrl}</div>

                <p style="margin:14px 0 0 0;">Thanks,<br/><strong>The Saraha Application Team</strong></p>
              </td>
            </tr>

            <tr>
              <td class="footer">
                <p style="margin:0 0 8px 0;">This is an automated message. Please do not reply.</p>
                <p style="margin:0;">&copy; 2024 Saraha Application. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;