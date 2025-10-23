import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/restify/organizations/${id}`,
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
        console.error('Error fetching organization:', error);
        return NextResponse.json(
            {error: error.response?.data?.message || 'Failed to fetch organization'},
            {status: error.response?.status || 500}
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;
        const body = await request.json();

        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/restify/organizations/${id}`,
            body,
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
        console.error('Error updating organization:', error);
        return NextResponse.json(
            {error: error.response?.data?.message || 'Failed to update organization'},
            {status: error.response?.status || 500}
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/restify/organizations/${id}`,
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
        console.error('Error deleting organization:', error);
        return NextResponse.json(
            {error: error.response?.data?.message || 'Failed to delete organization'},
            {status: error.response?.status || 500}
        );
    }
}