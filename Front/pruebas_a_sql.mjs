import pkg from 'pg';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

const { Client } = pkg;

// Configurar la conexión a PostgreSQL
const client = new Client({
  connectionString: 'postgresql://hoteldb_owner:npg_qSacGLXyk27K@ep-blue-mode-a8bo1n79-pooler.eastus2.azure.neon.tech/hoteldb?sslmode=require',
});

const obtenerPersonasPorReserva = async (reservaId) => {
  try {
    await client.connect();
    console.log(`🔹 Consultando personas de la reserva: ${reservaId}`);

    // Obtener la persona encargada de la reserva con sus datos completos
    const resEncargada = await client.query(
      `SELECT p.* FROM reservas_persona_encargada_lnk rpe
       JOIN personas p ON rpe.persona_id = p.id
       WHERE rpe.reserva_id = $1`,
      [reservaId]
    );
    console.log('🔹 Persona encargada:', resEncargada.rows);

    // Obtener las demás personas asignadas a la reserva con sus datos completos
    const resAcompanantes = await client.query(
      `SELECT p.* FROM reservas_habitacion_lnk rhl
       JOIN personas p ON rhl.habitacion_id = p.id
       WHERE rhl.reserva_id = $1`,
      [reservaId]
    );
    console.log('🔹 Acompañantes:', resAcompanantes.rows);
  } catch (error) {
    console.error('❌ Error al consultar la base de datos:', error);
  } finally {
    await client.end();
  }
};

const handleCrearReserva = async () => {
  try {
    const fechaEntrada = "2025-03-15";
    const fechaSalida = "2025-03-16";

    const personas = [
      {
        dni: '37624311',
        nombre: 'Leandro',
        apellido: 'Eugenio',
        edad_persona: '30',
        telefono: '2625500165',
        esEncargada: true
      },
      {
        dni: '41004708',
        nombre: 'Mariana',
        apellido: 'Gonzalez',
        edad_persona: '28',
        telefono: '2625500170',
        esEncargada: false
      }
    ];

    const id_habitacion = 1;
    console.log("Datos de reserva:", fechaEntrada, fechaSalida, personas);

    const id_reserva = uuidv4();
    let idPersonaEncargada = null;
    let acompanantesIds = [];

    for (const persona of personas) {
      console.log(`Verificando si la persona con DNI: ${persona.dni} ya existe`);
      const responsePersonaExistente = await fetch(
        `http://localhost:1337/api/personas?filters[dni_persona][$eq]=${persona.dni}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      const personaExistente = await responsePersonaExistente.json();

      if (personaExistente.data.length > 0) {
        const idPersonaExistente = personaExistente.data[0].id;
        if (persona.esEncargada) {
          idPersonaEncargada = idPersonaExistente;
        } else {
          acompanantesIds.push(idPersonaExistente);
        }
      } else {
        const responseCrearPersona = await fetch(
          "http://localhost:1337/api/personas",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              data: {
                id_persona: uuidv4(),
                dni_persona: persona.dni,
                nombre_persona: persona.nombre,
                apellido_persona: persona.apellido,
                telefono: persona.telefono,
                edad_persona: persona.edad_persona,
                es_encargada: persona.esEncargada,
                reingreso_persona: 0,
                habitacion: id_habitacion,
              },
            }),
          }
        );
        const personaCreada = await responseCrearPersona.json();
        console.log(`Persona ${persona.nombre} ${persona.apellido} creada:`, personaCreada);

        if (personaCreada.data) {
          if (persona.esEncargada) {
            idPersonaEncargada = personaCreada.data.id;
          } else {
            acompanantesIds.push(personaCreada.data.id);
          }
        }
      }
    }

    const responseReserva = await fetch(
      "http://localhost:1337/api/reservas",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            fecha_de_entrada: fechaEntrada,
            fecha_de_salida: fechaSalida,
            habitacion: id_habitacion,
            id_reserva: id_reserva,
            persona_encargada: idPersonaEncargada,
            acompanantes: acompanantesIds,
          },
        }),
      }
    );

    const reservaCreada = await responseReserva.json();
    console.log("Reserva creada con personas asignadas:", reservaCreada);

  } catch (error) {
    console.error("Error al crear la reserva y asignar personas:", error);
  }
};

// Llamar a la función con un ID de reserva de prueba
obtenerPersonasPorReserva(177);
handleCrearReserva();
