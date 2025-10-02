import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  const page = Number(searchParams.get('page') ?? '1') || 1
  const pageSize = Math.min(Number(searchParams.get('pageSize') ?? '20') || 20, 100)

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: 'insensitive' as const } },
          { code: { contains: q, mode: 'insensitive' as const } },
          { barcode: { contains: q, mode: 'insensitive' as const } },
        ],
      }
    : {}

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({ items, total, page, pageSize })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json()
  const created = await prisma.product.create({
    data: {
      code: data.code,
      barcode: data.barcode || null,
      name: data.name,
      category: data.category || null,
      unit: data.unit || null,
      costBase: data.costBase,
      priceBase: data.priceBase,
      vatRate: data.vatRate ?? 21,
      stockMin: data.stockMin ?? null,
      active: data.active ?? true,
    },
  })
  return NextResponse.json(created, { status: 201 })
}
