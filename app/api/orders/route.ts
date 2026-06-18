import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const order = await prisma.order.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      company: body.company ?? null,
      eik: body.eik ?? null,
      vat: body.vat ?? null,
      mol: body.mol ?? null,
      carrier: body.carrier,
      delivType: body.delivType,
      city: body.city,
      address: body.address ?? null,
      postcode: body.postcode ?? null,
      payment: body.payment,
      total: body.total,
      items: {
        create: body.items.map((item: { id: number; name: string; slug: string; price: number; quantity: number; image: string }) => ({
          productId: item.id ?? null,
          name: item.name,
          slug: item.slug,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
      },
    },
  });

  return NextResponse.json({ ok: true, orderId: order.id }, { status: 201 });
}
