// Email Service using Resend
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

// Email templates
export const emailTemplates = {
  welcome: (name, email) => ({
    to: email,
    subject: 'Welcome to Excellere - Your AI Leadership Journey Starts Now',
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', sans-serif; background: #000; color: #fff; padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; }
    .logo { font-family: 'Playfair Display', serif; font-size: 24px; letter-spacing: 6px; color: #d4af37; text-align: center; margin-bottom: 30px; }
    .card { background: #0a0a0a; border: 1px solid #222; padding: 30px; border-radius: 4px; }
    h1 { color: #fff; font-size: 24px; margin-bottom: 20px; }
    p { color: #888; line-height: 1.6; margin-bottom: 16px; }
    .button { display: inline-block; background: #d4af37; color: #000; padding: 14px 28px; text-decoration: none; font-weight: 600; margin-top: 20px; }
    .footer { text-align: center; margin-top: 40px; color: #444; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">✦ EXCELLERE</div>
    <div class="card">
      <h1>Welcome, ${name}!</h1>
      <p>Your AI leadership journey starts now. You've taken the first step toward becoming an AI-native leader.</p>
      <p>Here's what happens next:</p>
      <p>🎯 <strong>Module 1:</strong> AI-Native Business Design<br/>
         🔄 <strong>Module 2:</strong> Double Loop Strategy<br/>
         🤖 <strong>Module 3:</strong> Agentic AI</p>
      <p>Each module includes personalized assessments, and when you complete the programme, your credential will be validated by world-renowned faculty.</p>
      <a href="https://excellere.vercel.app/dashboard" class="button">START LEARNING</a>
    </div>
    <div class="footer">
      © 2026 Excellere. All rights reserved.<br/>
      Building AI-native leaders.
    </div>
  </div>
</body>
</html>
    `
  }),

  reportReady: (name, moduleName, reportUrl) => ({
    to: name.email,
    subject: `Your Assessment Report is Ready - ${moduleName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', sans-serif; background: #000; color: #fff; padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; }
    .logo { font-family: 'Playfair Display', serif; font-size: 24px; letter-spacing: 6px; color: #d4af37; text-align: center; margin-bottom: 30px; }
    .card { background: #0a0a0a; border: 1px solid #222; padding: 30px; border-radius: 4px; }
    h1 { color: #fff; font-size: 24px; margin-bottom: 20px; }
    p { color: #888; line-height: 1.6; margin-bottom: 16px; }
    .button { display: inline-block; background: #d4af37; color: #000; padding: 14px 28px; text-decoration: none; font-weight: 600; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">✦ EXCELLERE</div>
    <div class="card">
      <h1>Your Report is Ready</h1>
      <p>Hi ${name.firstName},</p>
      <p>Aria has completed your assessment for <strong>${moduleName}</strong>.</p>
      <p>Your report includes:</p>
      <ul style={{color: '#888'}}>
        <li>What you mastered</li>
        <li>Where you're building</li>
        <li>What Aria noticed about your thinking</li>
        <li>Your next recommended module</li>
      </ul>
      <a href="${reportUrl}" class="button">VIEW YOUR REPORT</a>
    </div>
  </div>
</body>
</html>
    `
  }),

  validationComplete: (name, validatorName, credentialUrl) => ({
    to: name.email,
    subject: `Your Credential is Live - Validated by ${validatorName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', sans-serif; background: #000; color: #fff; padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; }
    .logo { font-family: 'Playfair Display', serif; fontSize: 24px; letter-spacing: 6px; color: #d4af37; text-align: center; margin-bottom: 30px; }
    .card { background: #0a0a0a; border: 1px solid #222; padding: 30px; border-radius: 4px; }
    h1 { color: #fff; fontSize: 24px; margin-bottom: 20px; }
    p { color: #888; line-height: 1.6; margin-bottom: 16px; }
    .button { display: inline-block; background: #d4af37; color: #000; padding: 14px 28px; textDecoration: none; font-weight: 600; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">✦ EXCELLERE</div>
    <div class="card">
      <h1>🎉 Credential Validated!</h1>
      <p>Hi ${name.firstName},</p>
      <p>Great news! <strong>${validatorName}</strong> has reviewed and validated your assessment.</p>
      <p>Your credential is now live and ready to share on your CV or LinkedIn.</p>
      <a href="${credentialUrl}" class="button">VIEW CREDENTIAL</a>
    </div>
  </div>
</body>
</html>
    `
  }),

  validatorQueue: (validatorName, queueCount) => ({
    to: validatorName.email,
    subject: `${queueCount} New Reports Waiting for Your Review`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', sans-serif; background: #000; color: #fff; padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; }
    .logo { font-family: 'Playfair Display', serif; font-size: 24px; letter-spacing: 6px; color: #d4af37; text-align: center; margin-bottom: 30px; }
    .card { background: #0a0a0a; border: 1px solid #222; padding: 30px; border-radius: 4px; }
    h1 { color: #fff; font-size: 24px; margin-bottom: 20px; }
    p { color: #888; line-height: 1.6; margin-bottom: 16px; }
    .button { display: inline-block; background: #d4af37; color: #000; padding: 14px 28px; text-decoration: none; font-weight: 600; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">✦ EXCELLERE</div>
    <div class="card">
      <h1>Validation Queue</h1>
      <p>Hi ${validatorName.firstName},</p>
      <p>You have <strong>${queueCount} report(s)</strong> waiting for your review.</p>
      <a href="https://excellere.vercel.app/validate" class="button">VIEW QUEUE</a>
    </div>
  </div>
</body>
</html>
    `
  })
};

// Send email function
export async function sendEmail(to, template, data) {
  try {
    const emailContent = emailTemplates[template](data);
    
    // Don't actually send in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email would be sent:', emailContent.subject);
      return { success: true, preview: emailContent };
    }
    
    const result = await resend.emails.send({
      from: 'Excellere <noreply@excellere.ai>',
      to: typeof to === 'string' ? to : to.email,
      subject: emailContent.subject,
      html: emailContent.html
    });
    
    return { success: true, result };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
}

export default { sendEmail, emailTemplates };
