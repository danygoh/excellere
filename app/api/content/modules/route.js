import { NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET() {
  try {
    const modules = await db.getModules();
    
    // Fetch concepts for each module
    const modulesWithConcepts = await Promise.all(
      modules.map(async (module) => {
        const fullModule = await db.getModule(module.id);
        return fullModule;
      })
    );
    
    return NextResponse.json({ success: true, modules: modulesWithConcepts });
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
