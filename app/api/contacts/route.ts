import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/restify/contacts`,
            {
                headers: {
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            }
        );

        return NextResponse.json(response.data);
    } catch(error: any) {
        console.error('Error fetching contacts:', error);
        return NextResponse.json(
            {error: error.response?.data?.message || 'Failed to fetch contacts'},
            {status: error.response?.status || 500}
        );
    }
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;
        const body = await request.json();

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/restify/contacts`,
            body,
            {
                headers: {
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            }
        );

        return NextResponse.json(response.data, { status: 201 });
    } catch(error: any) {
        console.error('Error creating contact:', error);
        return NextResponse.json(
            {error: error.response?.data?.message || 'Failed to create contact'},
            {status: error.response?.status || 500}
        );
    }
}