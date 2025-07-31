"use client";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function CarruselPublicidad({ banners }) {
    const [index, setIndex] = useState(0);
    const intervalRef = useRef();

    useEffect(() => {
        if (!banners || banners.length <= 1) return;
        intervalRef.current = setInterval(() => {
            setIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(intervalRef.current);
    }, [banners]);

    if (!banners || banners.length === 0) return null;

    const current = banners[index];
    const isTop = current.position === "top";

    return (
        <div className="w-full relative rounded-xl">
            <a
                href={current.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
                style={{ lineHeight: 0 }}
            >
                {isTop ? (
                    <>
                        {/* Imagen mobile solo en pantallas chicas */}
                        {current.mobileImage?.[0]?.url && (
                            <img
                                src={current.mobileImage[0].url}
                                alt={current.name || "Banner"}
                                loading="lazy"
                                 className="w-full h-auto object-contain rounded-xl block sm:hidden"
                                style={{ maxHeight: "80vh" }}
                            />
                        )}

                        {/* Imagen desktop en pantallas sm+ */}
                        {current.desktopImage?.url && (
                            <img
                                src={current.desktopImage.url}
                                alt={current.name || "Banner"}
                                loading="lazy"
                                className="w-full h-auto object-contain rounded-xl hidden sm:block mx-auto"
                                style={{ maxHeight: "80vh" }}
                            />
                        )}
                    </>
                ) : (
                    // En cualquier otra posición solo mostrar imagen desktop
                    current.desktopImage?.url ? (
                        <img
                            src={current.desktopImage.url}
                            alt={current.name || "Banner"}
                            loading="lazy"
                            className="w-full block rounded-xl mx-auto"
                            style={{ height: 'auto' }}
                        />
                    ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-xl">
                            Sin imagen
                        </div>
                    )
                )}
            </a>

            {banners.length > 1 && (
                <>
                    <button
                        onClick={() =>
                            setIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
                        }
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white rounded-full p-2 hover:bg-opacity-50 transition"
                    >
                        <ArrowBigLeft />
                    </button>
                    <button
                        onClick={() => setIndex((prev) => (prev + 1) % banners.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white rounded-full p-2 hover:bg-opacity-50 transition"
                    >
                        <ArrowBigRight />
                    </button>
                </>
            )}
        </div>
    );
}
