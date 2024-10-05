import { NextResponse } from 'next/server';
import { prismaClient } from "@prismaClient/singleton"; // Ensure this import is present

export async function POST(req: Request) {
    const { OTP, email } = await req.json();

    if (!OTP || !email) {
        return NextResponse.json({ error: 'invalid token or projectID' }, { status: 400 });
    }

    try {
        // Verify the token against your database
        const latestOTPRecord = await prismaClient.oTP.findFirst({
            where: { email: email },
            orderBy: { createdAt: 'desc' }
        });

        // check if token is valid
        const isValid = (latestOTPRecord && OTP === latestOTPRecord.code);
        if (!isValid) {
            return NextResponse.json({ error: `invalid OTP: ${OTP}` }, { status: 400 });
        }

        // if valid, update the user's email verification status in the database
        const updatedUser = await prismaClient.user.update({
            where: {
                email: email
            },
            data: {
                emailVerified: true, // Assuming you have an emailVerified field
            }
        });
        if (!updatedUser) {
            return NextResponse.json({ error: 'cannot update email verification state' }, { status: 500 });
        }

        return NextResponse.json({ message: `valid OTP ${OTP}` }, { status: 200 });
    } catch (error) {
        console.error('error verifying email: ', error);
        return NextResponse.json({ error: 'error verifying email' }, { status: 500 });
    }
}