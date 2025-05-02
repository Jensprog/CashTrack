import { runTests } from '@/tests/manualUnitTests';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Kör testerna och returnera resultatet
    await runTests();
    return NextResponse.json({
      success: true,
      message: 'Tests completed. Check server console for results.',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
