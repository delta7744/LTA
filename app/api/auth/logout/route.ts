import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/session';

export async function POST() {
    await deleteSession();
    const response = NextResponse.json({ message: 'Logged out successfully' });
    return response;
}