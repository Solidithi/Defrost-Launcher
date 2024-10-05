import { NextResponse } from "next/server";
import { prismaClient } from "@prismaClient/singleton";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: 'email is required' }, { status: 400 });
        }

        const user = await prismaClient.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            return NextResponse.json({ error: 'email not found' }, { status: 404 });
        }

        return NextResponse.json({
            data: {
                verified: user?.emailVerified ? user.emailVerified.toString() : 'false',
            }
        }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({
            error: (err as Error).message ?? '',
            cause: (err as Error).cause ?? '',
            stacktrace: (err as Error).stack ?? '',
        }, { status: 500 })
    }
}