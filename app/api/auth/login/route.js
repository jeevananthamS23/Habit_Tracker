import dbConnect from '../../../../lib/mongodb'; 
import User from '../../../../models/User'; 
import { generateSessionCookie } from '../../../../lib/auth';


export async function POST(req) {
  await dbConnect(); 

  try {
    const { email, password } = await req.json();

        if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Please enter all fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }


    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const sessionCookie = generateSessionCookie(user._id.toString());

  
    const response = new Response(JSON.stringify({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email },
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': sessionCookie,
      },
    });

    return response;

  } catch (error) {
    console.error('Login API error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
