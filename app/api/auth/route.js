// Auth API Routes
import { NextResponse } from 'next/server';

// In-memory users (replace with Supabase in production)
const users = new Map();

// Seed validator accounts
const seedValidators = () => {
  const validators = [
    { id: 'v1', email: 'mark@excellere.ai', password: 'validator123', name: 'Prof. Mark Esposito', role: 'validator', title: 'Harvard / Hult', institution: 'Harvard University' },
    { id: 'v2', email: 'terence@excellere.ai', password: 'validator123', name: 'Prof. Terence Tse', role: 'validator', title: 'ESCP Business School', institution: 'ESCP' },
    { id: 'v3', email: 'danny@excellere.ai', password: 'validator123', name: 'Danny Goh', role: 'validator', title: 'Excellere', institution: 'Excellere' },
  ];
  validators.forEach(v => users.set(v.email, v));
};

// Initialize seed data
seedValidators();

// Demo learner account
users.set('sarah@fintech.com', { 
  id: 'l1', email: 'sarah@fintech.com', password: 'learner123', 
  name: 'Sarah Chen', role: 'learner', 
  organisation: 'FinTech Global', job_title: 'COO'
});

export async function POST(request) {
  const { action, email, password, name, role, ...profile } = await request.json();
  
  if (action === 'login') {
    const user = users.get(email);
    
    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({ 
      success: true, 
      user: userWithoutPassword,
      token: Buffer.from(email).toString('base64')
    });
  }
  
  if (action === 'signup') {
    if (users.has(email)) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }
    
    const newUser = {
      id: 'l' + Date.now(),
      email,
      password,
      name,
      role: role || 'learner',
      ...profile,
      created_at: new Date().toISOString()
    };
    
    users.set(email, newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json({ 
      success: true, 
      user: userWithoutPassword,
      token: Buffer.from(email).toString('base64')
    });
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }
  
  try {
    const email = Buffer.from(token, 'base64').toString();
    const user = users.get(email);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
