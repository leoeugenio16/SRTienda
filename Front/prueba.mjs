import fetch from 'node-fetch';

// URL base de la API de Strapi
const STRAPI_URL = 'http://localhost:1337/api';

// Función para obtener los datos de la relación reserva-persona-habitación
async function obtenerRelacionReserva(idReserva) {
  try {
    const url = `${STRAPI_URL}/reservas-personas-habitaciones?filters[id_reserva][$eq]=${idReserva}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.data.length > 0) {
      return data.data[0]; // Retorna la primera relación encontrada
    } else {
      console.log(`No se encontró la relación para la reserva ${idReserva}`);
      return null;
    }
  } catch (error) {
    console.error('Error al obtener la relación reserva-persona-habitación:', error);
    return null;
  }
}

// Función para obtener los datos de la reserva
async function obtenerReserva(idReserva) {
  try {
    const url = `${STRAPI_URL}/reservas/${idReserva}`;
    console.log(`URL de la solicitud: ${url}`);
    const response = await fetch(url);
    console.log(`Estado de la respuesta: ${response.status} ${response.statusText}`);
    const data = await response.json();
    console.log(`Datos de la respuesta: ${JSON.stringify(data)}`);
    
    if (data.data) {
      return data.data; // Retorna los datos de la reserva
    } else {
      console.log(`No se encontró la reserva con ID ${idReserva}`);
      return null;
    }
  } catch (error) {
    console.error('Error al obtener la reserva:', error);
    return null;
  }
}

// Función para obtener los datos de la persona
async function obtenerPersona(idPersona) {
  try {
    const url = `${STRAPI_URL}/personas/${idPersona}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.data) {
      return data.data; // Retorna los datos de la persona
    } else {
      console.log(`No se encontró la persona con ID ${idPersona}`);
      return null;
    }
  } catch (error) {
    console.error('Error al obtener la persona:', error);
    return null;
  }
}

// Función para obtener los datos de la habitación
async function obtenerHabitacion(idHabitacion) {
  try {
    const url = `${STRAPI_URL}/habitaciones/${idHabitacion}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.data) {
      return data.data; // Retorna los datos de la habitación
    } else {
      console.log(`No se encontró la habitación con ID ${idHabitacion}`);
      return null;
    }
  } catch (error) {
    console.error('Error al obtener la habitación:', error);
    return null;
  }
}

// Función principal que realiza las consultas
async function realizarConsultas(idReserva) {
  console.log('⏳ Consultando datos de la reserva...');

  // Obtener la relación reserva-persona-habitación
  const relacion = await obtenerRelacionReserva(idReserva);

  if (relacion) {
    const { id_persona, id_habitacion } = relacion;

    // Obtener los detalles de la reserva
    const reserva = await obtenerReserva(idReserva);
    console.log('Detalles de la reserva:', reserva);

    // Obtener los detalles de la persona
    const persona = await obtenerPersona(id_persona);
    console.log('Detalles de la persona:', persona);

    // Obtener los detalles de la habitación
    const habitacion = await obtenerHabitacion(id_habitacion);
    console.log('Detalles de la habitación:', habitacion);
  }
}

// Llamar a la función principal con un id_reserva específico
const idReserva = 13;  // Cambia este ID por el que quieras consultar
realizarConsultas(idReserva);
