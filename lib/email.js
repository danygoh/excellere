// Email Service using Resend
// Production-ready email templates for Excellere

import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Email templates
const templates = {
  welcome: (user) => ({
    subject: 'Welcome to Excellere — Your AI Leadership Journey Starts Now',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Excellere</title>
</head>
<body style="margin:0; padding:0; background:#000; font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#000; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding:30px 0;">
              <span style="font-family:'Playfair Display',serif; font-size:24px; letter-spacing:6px; color:#d4af37;">✦ EXCELLERE</span>
            </td>
          </tr>
          
          <!-- Content Card -->
          <tr>
            <td style="background:#0a0a0a; border:1px solid #222; border-radius:8px; padding:40px;">
              <h1 style="color:#fff; font-size:28px; font-weight:400; margin:0 0 20px; font-family:'Playfair Display',serif;">
                Welcome, ${user.firstName}!
              </h1>
              <p style="color:#888; font-size:15px; line-height:1.7; margin:0 0 16px;">
                Your AI leadership journey starts now. You've taken the first step toward becoming an AI-native leader.
              </p>
              <p style="color:#888; font-size:15px; line-height:1.7; margin:0 0 24px;">
                Here's what to expect:
              </p>
              <ul style="color:#888; font-size:14px; line-height:2; margin:0 0 30px; padding-left:20px;">
                <li><span style="color:#d4af37;">🎯</span> <strong>Module 1:</strong> AI-Native Business Design</li>
                <li><span style="color:#d4af37;">🔄</span> <strong>Module 2:</strong> Double Loop Strategy</li>
                <li><span style="color:#d4af37;">🤖</span> <strong>Module 3:</strong> Agentic AI</li>
              </ul>
              <a href="https://excellere.vercel.app/dashboard" style="display:inline-block; background:#d4af37; color:#000; padding:14px 28px; text-decoration:none; font-weight:600; font-size:14px;">
                START LEARNING →
              </a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding:30px 0; color:#444; font-size:12px;">
              © 2026 Excellere. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  }),

  reportReady: (user, report) => ({
    subject: `Your Assessment Report is Ready — ${report.module_name}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Report Ready</title>
</head>
<body style="margin:0; padding:0; background:#000; font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#000; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">
          <tr>
            <td align="center" style="padding:30px 0;">
              <span style="font-family:'Playfair Display',serif; font-size:24px; letter-spacing:6px; color:#d4af37;">✦ EXCELLERE</span>
            </td>
          </tr>
          
          <tr>
            <td style="background:#0a0a0a; border:1px solid #222; border-radius:8px; padding:40px;">
              <h1 style="color:#fff; font-size:24px; font-weight:400; margin:0 0 20px; font-family:'Playfair Display',serif;">
                Your Report is Ready
              </h1>
              <p style="color:#888; font-size:15px; line-height:1.7; margin:0 0 16px;">
                Hi ${user.firstName},
              </p>
              <p style="color:#888; font-size:15px; line-height:1.7; margin:0 0 16px;">
                Aria has completed your assessment for <strong style="color:#fff;">${report.module_name}</strong>.
              </p>
              <p style="color:#888; font-size:15px; line-height:1.7; margin:0 0 24px;">
                Your report includes what you mastered, where you're building, what Aria noticed about your thinking, and your next steps.
              </p>
              <a href="https://excellere.vercel.app/c/${report.share_slug}" style="display:inline-block; background:#d4af37; color:#000; padding:14px 28px; text-decoration:none; font-weight:600; font-size:14px;">
                VIEW YOUR REPORT →
              </a>
            </td>
          </tr>
          
          <tr>
            <td align="center" style="padding:30px 0; color:#444; font-size:12px;">
              © 2026 Excellere. Building AI-native leaders.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  }),

  validationComplete: (user, report, validator) => ({
    subject: `Your Credential is Live — Validated by ${validator.name}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Credential Validated</title>
</head>
<body style="margin:0; padding:0; background:#000; font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#000; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">
          <tr>
            <td align="center" style="padding:30px 0;">
              <span style="font-family:'Playfair Display',serif; font-size:24px; letter-spacing:6px; color:#d4af37;">✦ EXCELLERE</span>
            </td>
          </tr>
          
          <tr>
            <td style="background:#0a0a0a; border:1px solid #222; border-radius:8px; padding:40px;">
              <div style="font-size:48px; text-align:center; margin-bottom:20px;">🎉</div>
              <h1 style="color:#fff; font-size:24px; font-weight:400; margin:0 0 20px; font-family:'Playfair Display',serif; text-align:center;">
                Credential Validated!
              </h1>
              <p style="color:#888; font-size:15px; line-height:1.7; margin:0 0 16px; text-align:center;">
                Hi ${user.firstName},
              </p>
              <p style="color:#888; font-size:15px; line-height:1.7; margin:0 0 16px; text-align:center;">
                Great news! <strong style="color:#fff;">${validator.name}</strong> has reviewed and validated your assessment.
              </p>
              <div style="background:#0a0a0a; border:1px solid #d4af37; border-radius:8px; padding:20px; margin:20px 0; text-align:center;">
                <p style="color:#d4af37; font-size:12px; margin:0 0 8px;">VALIDATOR COMMENT</p>
                <p style="color:#fff; font-size:14px; font-style:italic; margin:0;">"${report.validator_comment}"</p>
                <p style="color:#666; font-size:12px; margin:12px 0 0;">— ${validator.name}</p>
              </div>
              <a href="https://excellere.vercel.app/c/${report.share_slug}" style="display:inline-block; background:#d4af37; color:#000; padding:14px 28px; text-decoration:none; font-weight:600; font-size:14px;">
                VIEW CREDENTIAL →
              </a>
            </td>
          </tr>
          
          <tr>
            <td align="center" style="padding:30px 0; color:#444; font-size:12px;">
              © 2026 Excellere. Building AI-native leaders.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  }),

  validatorQueue: (validator, queueCount) => ({
    subject: `${queueCount} New Report${queueCount > 1 ? 's' : ''} Waiting for Your Review`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Validation Queue</title>
</head>
<body style="margin:0; padding:0; background:#000; font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#000; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">
          <tr>
            <td align="center" style="padding:30px 0;">
              <span style="font-family:'Playfair Display',serif; font-size:24px; letter-spacing:6px; color:#d4af37;">✦ EXCELLERE</span>
            </td>
          </tr>
          
          <tr>
            <td style="background:#0a0a0a; border:1px solid #222; border-radius:8px; padding:40px;">
              <h1 style="color:#fff; font-size:24px; font-weight:400; margin:0 0 20px; font-family:'Playfair Display',serif;">
                Validation Queue
              </h1>
              <p style="color:#888; font-size:15px; line-height:1.7; margin:0 0 16px;">
                Hi ${validator.firstName},
              </p>
              <p style="color:#888; font-size:15px; line-height:1.7; margin:0 0 24px;">
                You have <strong style="color:#d4af37; font-size:18px;">${queueCount} report${queueCount > 1 ? 's' : ''}</strong> waiting for your review.
              </p>
              <a href="https://excellere.vercel.app/validate" style="display:inline-block; background:#d4af37; color:#000; padding:14px 28px; text-decoration:none; font-weight:600; font-size:14px;">
                VIEW QUEUE →
              </a>
            </td>
          </tr>
          
          <tr>
            <td align="center" style="padding:30px 0; color:#444; font-size:12px;">
              © 2026 Excellere. Building AI-native leaders.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  })
};

// Send email function
export async function sendEmail(to, templateName, data) {
  const template = templates[templateName];
  if (!template) {
    return { success: false, error: 'Unknown template' };
  }
  
  const emailContent = template(data);
  
  // Development mode - just log
  if (!resend) {
    console.log('📧 [DEV] Email would be sent:');
    console.log('   To:', to);
    console.log('   Subject:', emailContent.subject);
    return { success: true, preview: emailContent };
  }
  
  try {
    const result = await resend.emails.send({
      from: 'Excellere <hello@excellere.ai>',
      to: to,
      subject: emailContent.subject,
      html: emailContent.html
    });
    
    return { success: true, result };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
}

export default { sendEmail };
