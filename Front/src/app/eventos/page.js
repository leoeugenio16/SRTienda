"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getImageUrl } from "../../utils/getImageUrl";

function formatFecha(fechaStr) {
  const d = new Date(fechaStr);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

async function fetchEventos() {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/eventos?populate=images&filters[estado][$eq]=activo&sort=start_date:asc`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error("Error al obtener eventos:", await res.text());
      return [];
    }
    const data = await res.json();
    return data.data.map((item) => {
      const imagesData = Array.isArray(item.images) ? item.images : [];
      const images = imagesData.map((img) => {
        const url = img.url || "";
        return {
          url: url.startsWith("http")
            ? url
            : process.env.NEXT_PUBLIC_STRAPI_URL + url,
        };
      });
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        price_sale: item.price_sale,
        start_date: item.start_date,
        end_date: item.end_date,
        estado: item.estado,
        destacar: item.destacar,
        slug: item.slug,
        images,
      };
    });
  } catch (error) {
    console.error("Error fetch eventos:", error);
    return [];
  }
}

function obtenerFechasValidas(eventos) {
  const fechasSet = new Set();

  eventos.forEach(({ start_date, end_date }) => {
    const start = new Date(start_date);
    const end = new Date(end_date);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      fechasSet.add(d.toISOString().slice(0, 10));
    }
  });

  return fechasSet;
}

function CalendarioEventos({ fechasValidas, onSelectDate }) {
  const [value, setValue] = useState(null);

  const tileDisabled = ({ date }) => {
    const iso = date.toISOString().slice(0, 10);
    return !fechasValidas.has(iso);
  };

  const tileClassName = ({ date }) => {
    const iso = date.toISOString().slice(0, 10);
    if (fechasValidas.has(iso)) {
      return "bg-orange-100 hover:bg-orange-600 hover:text-white dark:bg-orange-900 dark:hover:bg-orange-600";
    }
    return "text-gray-400 dark:text-gray-500";
  };

  const handleChange = (date) => {
    setValue(date);
    onSelectDate(date); // guardar como Date, no como string ISO
  };

  return (
    <div className="max-w-md mx-auto [&_.react-calendar]:w-full [&_.react-calendar]:bg-white [&_.react-calendar]:dark:bg-gray-800 [&_.react-calendar]:text-black [&_.react-calendar]:dark:text-white [&_.react-calendar__tile--active]:bg-orange-600 [&_.react-calendar__tile--active]:text-white [&_.react-calendar__tile--now]:border-orange-500 [&_.react-calendar__navigation__label]:text-lg [&_.react-calendar__tile]:p-2 [&_.react-calendar__tile]:rounded">
      <Calendar
        onChange={handleChange}
        value={value}
        tileDisabled={tileDisabled}
        tileClassName={tileClassName}
        locale="es-AR"
      />
    </div>
  );
}

export default function EventosPage() {
  const [eventos, setEventos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [destacados, setDestacados] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [fechasValidas, setFechasValidas] = useState(new Set());
  const [mostrarIntro, setMostrarIntro] = useState(false);

  useEffect(() => {
    const yaVisto = sessionStorage.getItem("intro_proveedor");
    if (!yaVisto) {
      setMostrarIntro(true);
    }
  }, []);
  useEffect(() => {
    async function cargarEventos() {
      const datos = await fetchEventos();
      setEventos(datos);
      setDestacados(datos.filter((e) => e.destacar));
      setFechasValidas(obtenerFechasValidas(datos));
    }
    cargarEventos();
  }, []);

  const eventosFiltrados = fechaSeleccionada
    ? eventos.filter((e) => {
        const fecha = new Date(fechaSeleccionada);
        fecha.setHours(0, 0, 0, 0);

        const start = new Date(e.start_date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(e.end_date);
        end.setHours(0, 0, 0, 0);

        return (
          fecha.getTime() >= start.getTime() && fecha.getTime() <= end.getTime()
        );
      })
    : [];

  useEffect(() => {
    console.log("🟡 Fecha seleccionada:", fechaSeleccionada);
  }, [fechaSeleccionada]);

  useEffect(() => {
    console.log("🟢 Eventos cargados:", eventos);
    console.log("🔵 Fechas válidas:", Array.from(fechasValidas));
  }, [eventos, fechasValidas]);
  useEffect(() => {
    if (destacados.length === 0) return;
    const timer = setInterval(() => {
      setCarouselIndex((i) => (i + 1) % destacados.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [destacados.length]);
  const eventoDestacado =
    destacados.length > 0 ? destacados[carouselIndex] : null;
  if (mostrarIntro) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl border border-orange-500 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">
            🎉 Bienvenido a la sección de eventos
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            En esta sección vas a encontrar todo tipo de eventos ordenados por
            fecha o destacados. ¿Querés hacer algo el viernes? ¿Salir a comer el
            sábado? ¿Buscar ferias, música en vivo o actividades al aire libre?
            Elegí el día que te interesa y descubrí qué está pasando en San
            Rafael. ¡Siempre hay algo para hacer!
          </p>
          <button
            onClick={() => {
              sessionStorage.setItem("intro_proveedor", "true");
              setMostrarIntro(false);
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full transition"
          >
            Aceptar
          </button>
        </div>
      </div>
    );
  }
  return (
    <main className="bg-white dark:bg-gray-900 dark:text-white min-h-screen pt-6 p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-center text-orange-600">
        Eventos destacados
      </h1>

      {destacados.length > 0 && (
        <section className="relative mb-6 select-none max-w-6xl mx-auto">
          {/* Botón anterior */}
          <button
            onClick={() =>
              setCarouselIndex(
                (i) => (i - 1 + destacados.length) % destacados.length
              )
            }
            aria-label="Anterior"
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 transition z-10"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Carrusel flex horizontal con scroll oculto */}
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 md:px-0 justify-center">
            {/* Mostrar 2 en móvil, hasta 4 en desktop */}
            {Array.from({ length: Math.min(4, destacados.length) }).map(
              (_, i) => {
                const idx = (carouselIndex + i) % destacados.length;
                const evento = destacados[idx];
                return (
                  <a
                    key={evento.id}
                    href={`/eventos/${evento.slug}`}
                    className="relative w-1/2 md:w-1/4 h-48 rounded-lg shadow-lg overflow-hidden cursor-pointer bg-white dark:bg-gray-800 flex-shrink-0"
                  >
                    <img
                      src={getImageUrl(evento.images?.[0]) }
                      alt={evento.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 bg-orange-600 text-white rounded-full px-3 py-1 font-semibold text-sm z-20">
                      ${evento.price_sale.toLocaleString()}
                    </div>
                    <div className="absolute top-2 left-2 bg-orange-600 text-white rounded-full px-3 py-1 font-semibold text-sm z-20">
                      {formatFecha(evento.start_date)}
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-60 text-white px-3 py-2 font-semibold rounded-lg max-w-full overflow-hidden whitespace-nowrap text-ellipsis">
                      {evento.title}
                    </div>
                  </a>
                );
              }
            )}
          </div>

          {/* Botón siguiente */}
          <button
            onClick={() => setCarouselIndex((i) => (i + 1) % destacados.length)}
            aria-label="Siguiente"
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 transition z-10"
          >
            <ChevronRight size={24} />
          </button>
        </section>
      )}

      {!fechaSeleccionada && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Selecciona una fecha</h2>
          <CalendarioEventos
            fechasValidas={fechasValidas}
            onSelectDate={(fecha) => setFechaSeleccionada(fecha)} // guarda Date
          />
        </section>
      )}

      {fechaSeleccionada && (
        <section className="mb-6 flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded p-3">
          <p className="font-semibold text-lg">
            Fecha seleccionada: {fechaSeleccionada.toLocaleDateString()}
          </p>
          <button
            onClick={() => setFechaSeleccionada(null)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Cambiar fecha
          </button>
        </section>
      )}

      {fechaSeleccionada && (
        <section>
          {eventosFiltrados.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
              No hay eventos para la fecha seleccionada.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {eventosFiltrados.map((evento) => (
                <a
                  key={evento.id}
                  href={`/eventos/${evento.slug}`}
                  className="block border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white dark:bg-gray-800"
                >
                  <img
                    src={getImageUrl(evento.images?.[0]) || "/placeholder.jpg"}
                    alt={evento.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">
                      {evento.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      ${evento.price_sale.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(evento.start_date).toLocaleDateString()}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
