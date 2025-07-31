import { generateClearSessionCookie } from '../../../../lib/auth'; 


export async function POST(req) {
  try {
  
    const clearCookie = generateClearSessionCookie();

    const response = new Response(JSON.stringify({ message: 'Logout successful' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': clearCookie, 
      },
    });

    return response;
  } catch (error) {
    console.error('Logout API error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
