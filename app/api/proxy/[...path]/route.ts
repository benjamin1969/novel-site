// Proxy API route to Cloudflare Worker
import { NextRequest, NextResponse } from 'next/server';

const WORKER_API_URL = 'https://novel-platform-api.sunlongyun1030.workers.dev';

export async function GET(request: NextRequest) {
  return proxyRequest(request);
}

export async function POST(request: NextRequest) {
  return proxyRequest(request);
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request);
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request);
}

export async function OPTIONS(request: NextRequest) {
  return proxyRequest(request);
}

async function proxyRequest(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/proxy', '');
    const workerUrl = `${WORKER_API_URL}${path}${url.search}`;
    
    // Forward the request to Cloudflare Worker
    const response = await fetch(workerUrl, {
      method: request.method,
      headers: {
        ...Object.fromEntries(request.headers),
        'host': new URL(WORKER_API_URL).host,
      },
      body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text(),
    });

    // Create response with CORS headers
    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to Cloudflare Worker' },
      { status: 500 }
    );
  }
}