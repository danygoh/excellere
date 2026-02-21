// PDF Generation Service for Credentials
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function generateCredentialPDF(reportData, profile, validated = false, validator = null) {
  const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
  
  const launchOptions = isVercel ? {
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless
  } : {
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  };

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();
  
  const html = generatePDFHTML(reportData, profile, validated, validator);
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  
  await browser.close();
  return pdf;
}

function generatePDFHTML(reportData, profile, validated, validator) {
  const { report_title, executive_summary, aria_noticed, overall_score, mastery_percentage } = reportData;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${report_title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root { --primary: #1a1a2e; --accent: #e94560; --gold: #d4af37; --green: #2ecc71; --amber: #f39c12; }
    body { font-family: 'Inter', sans-serif; color: var(--primary); line-height: 1.6; }
    .page { width: 210mm; min-height: 297mm; margin: 0 auto; page-break-after: always; }
    
    /* Cover */
    .cover { background: linear-gradient(135deg, var(--primary) 0%, #16213e 100%); color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 50mm; }
    .logo { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; letter-spacing: 8px; margin-bottom: 50px; }
    .learner-name { font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 600; margin-bottom: 10px; }
    .role-sector { font-size: 16px; opacity: 0.8; margin-bottom: 30px; }
    .module-name { font-family: 'Playfair Display', serif; font-size: 22px; font-style: italic; }
    .date { margin-top: 40px; font-size: 12px; opacity: 0.6; }
    .status { margin-top: 20px; padding: 10px 24px; border-radius: 20px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; }
    .status.pending { background: rgba(243,156,18,0.2); border: 1px solid var(--amber); color: var(--amber); }
    .status.validated { background: rgba(46,204,113,0.2); border: 1px solid var(--green); color: var(--green); }
    
    /* Content */
    .content { padding: 40px 50px; }
    .section-title { font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: var(--accent); margin-bottom: 20px; }
    .headline { font-family: 'Playfair Display', serif; font-size: 26px; font-style: italic; margin-bottom: 20px; }
    .body { font-size: 14px; color: #444; margin-bottom: 30px; }
    
    /* Aria Noticed Box */
    .aria-box { background: linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%); border-left: 4px solid var(--gold); padding: 24px; margin: 20px 0; }
    .aria-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); margin-bottom: 12px; }
    .aria-observation { font-family: 'Playfair Display', serif; font-size: 18px; font-style: italic; line-height: 1.7; }
    .aria-prediction { margin-top: 16px; font-size: 13px; color: #666; font-style: italic; }
    
    /* Score */
    .score-section { text-align: center; margin-top: 40px; }
    .score-circle { width: 100px; height: 100px; border-radius: 50%; border: 4px solid var(--accent); display: inline-flex; flex-direction: column; justify-content: center; align-items: center; }
    .score-number { font-size: 32px; font-weight: 700; color: var(--accent); }
    .score-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
    
    /* Validator */
    .validator-page { display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 50px; text-align: center; }
    .validator-pending { padding: 60px; border: 2px dashed var(--amber); border-radius: 8px; }
    .validator-stamp { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--amber); letter-spacing: 2px; }
    .validator-validated { max-width: 500px; }
    .validator-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    .validator-photo { width: 60px; height: 60px; border-radius: 50%; background: var(--primary); }
    .validator-name { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 600; }
    .validator-title { font-size: 12px; color: #666; }
    .validator-comment { font-family: 'Playfair Display', serif; font-size: 20px; font-style: italic; line-height: 1.6; margin: 24px 0; }
    .validation-date { font-size: 11px; color: #888; }
    .verification { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 10px; color: #888; }
    
    .footer { position: absolute; bottom: 20px; left: 50px; right: 50px; text-align: center; font-size: 9px; color: #aaa; border-top: 1px solid #eee; padding-top: 12px; }
  </style>
</head>
<body>
  <!-- Page 1: Cover -->
  <div class="page cover">
    <div class="logo">EXCELLERE</div>
    <div class="learner-name">${profile.first_name} ${profile.last_name}</div>
    <div class="role-sector">${profile.role} · ${profile.sector}</div>
    <div class="module-name">${report_title}</div>
    <div class="date">Issued: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
    <div class="status ${validated ? 'validated' : 'pending'}">${validated ? '✓ Expert Validated' : 'Awaiting Validation'}</div>
  </div>
  
  <!-- Page 2: Report -->
  <div class="page">
    <div class="content">
      <div class="section-title">Executive Summary</div>
      <div class="headline">${executive_summary?.headline || ''}</div>
      <div class="body">${executive_summary?.body || ''}</div>
      
      <div class="aria-box">
        <div class="aria-label">What Aria Noticed</div>
        <div class="aria-observation">${aria_noticed?.observation || ''}</div>
        <div class="aria-prediction">${aria_noticed?.prediction || ''}</div>
      </div>
      
      <div class="score-section">
        <div class="score-circle">
          <span class="score-number">${overall_score || 0}</span>
          <span class="score-label">Score</span>
        </div>
      </div>
    </div>
    <div class="footer">This credential was issued by Excellere · excellere.ai</div>
  </div>
  
  <!-- Page 3: Validator -->
  <div class="page validator-page">
    ${validated && validator ? `
      <div class="validator-validated">
        <div class="validator-header">
          <div class="validator-photo"></div>
          <div>
            <div class="validator-name">${validator.name}</div>
            <div class="validator-title">${validator.title}</div>
          </div>
        </div>
        <div class="validator-comment">"${validator.comment || 'Excellent progress demonstrating genuine AI fluency.'}"</div>
        <div class="validation-date">Validated on ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        <div class="verification">Credential ID: EXC-${Date.now().toString(36).toUpperCase()}</div>
      </div>
    ` : `
      <div class="validator-pending">
        <div class="validator-stamp">Awaiting Expert Validation</div>
      </div>
    `}
  </div>
</body>
</html>`;
}

export default { generateCredentialPDF, generatePDFHTML };
