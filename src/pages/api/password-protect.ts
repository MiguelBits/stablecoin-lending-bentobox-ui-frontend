// api/password-protect.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import { serialize } from 'cookie';

// import { env } from 'lib/environment';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== 'POST') {
//     return res.status(405).send('Method Not Allowed');
//   }
//   const password = req.body.password;

//   if (env.NEXT_PUBLIC_APP_PASSWORD === password) {
//     const cookie = serialize('login', 'true', {
//       path: '/',
//       httpOnly: true,
//     });
//     res.setHeader('Set-Cookie', cookie);
//     res.redirect(302, '/');
//   } else {
//     return res.status(401).json({ status: 401, message: 'Incorrect Password' });
//   }
// }
