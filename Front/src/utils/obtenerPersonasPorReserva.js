import prisma from '../../prismaClient';

const obtenerPersonasPorReserva = async (reservaId) => {
  try {
    console.log(`🔹 Buscando personas de la reserva: ${reservaId}`);

    // Buscar persona encargada
    const personaEncargada = await prisma.$queryRaw`
      SELECT p.* FROM reservas_persona_encargada_lnk rpe
      JOIN personas p ON rpe.persona_id = p.id
      WHERE rpe.reserva_id = ${reservaId}
    `;

    // Buscar acompañantes
    const acompanantes = await prisma.$queryRaw`
      SELECT p.* FROM reservas_habitacion_lnk rhl
      JOIN personas p ON rhl.habitacion_id = p.id
      WHERE rhl.reserva_id = ${reservaId}
    `;

    console.log('🔹 Persona encargada:', personaEncargada);
    console.log('🔹 Acompañantes:', acompanantes);

    return {
      personaEncargada: personaEncargada.length ? personaEncargada[0] : null,
      acompanantes: acompanantes || [],
    };
  } catch (error) {
    console.error('❌ Error al obtener personas:', error);
    return { personaEncargada: null, acompanantes: [] };
  }
};

export default obtenerPersonasPorReserva;
