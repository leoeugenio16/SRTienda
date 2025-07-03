import { NextRequest, NextResponse } from 'next/server';
import obtenerPersonasPorReserva from '../../../utils/obtenerPersonasPorReserva';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reservaId = searchParams.get('reservaId');

  if (!reservaId) {
    return NextResponse.json({ error: 'reservaId es requerido' }, { status: 400 });
  }

  try {
    const personas = await obtenerPersonasPorReserva(Number(reservaId)); // Convierte a número si es necesario
    if (!personas) {
      return NextResponse.json({ error: 'No se encontraron personas para esta reserva' }, { status: 404 });
    }
    return NextResponse.json(personas);
  } catch (error) {
    console.error('Error al obtener personas:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
