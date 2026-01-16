import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function signJWT(payload: any, expiresIn: string = '24h') {
    if (!secretKey) throw new Error('JWT_SECRET is not defined');

    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(key);
}

export async function verifyJWT(token: string) {
    if (!secretKey) throw new Error('JWT_SECRET is not defined');

    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        return null;
    }
}
