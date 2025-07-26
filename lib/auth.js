import { serialize } from 'cookie';
const SESSION_COOKIE_NAME = 'habit_tracker_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'default_secret_for_dev'; 


export function generateSessionCookie(userId) {
  const cookie = serialize(SESSION_COOKIE_NAME, userId, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/', 
    sameSite: 'Lax', 
  });
  return cookie;
}


export function generateClearSessionCookie() {
  const cookie = serialize(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
    sameSite: 'Lax',
  });
  return cookie;
}

export function getUserIdFromSession(req) {
  const cookiesHeader = req.headers.get('cookie');
  if (!cookiesHeader) return null;

  const cookies = cookiesHeader.split('; ').reduce((acc, cookie) => {
    const [name, value] = cookie.split('=');
    acc[name.trim()] = value;
    return acc;
  }, {});

  return cookies[SESSION_COOKIE_NAME] || null;
}


export function protectedRoute(handler) {
  return async (req) => {
    const userId = getUserIdFromSession(req);

    if (!userId) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return handler(req);
  };
}
