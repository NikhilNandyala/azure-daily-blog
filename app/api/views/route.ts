import { NextRequest, NextResponse } from 'next/server'

export async function POST(_request: NextRequest) {
  return NextResponse.json({ views: 0 }, { status: 200 })
}

export async function GET(_request: NextRequest) {
  return NextResponse.json({ views: 0 }, { status: 200 })
}
