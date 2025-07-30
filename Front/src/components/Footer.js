export default function Footer() {
  return (
    <footer className="text-center text-sm text-gray-500 py-6 border-t mt-12">
      <p>
        <a href="/legales/terminos" className="underline hover:text-black dark:hover:text-white">
          Términos y Condiciones
        </a>{" "}
        |{" "}
        <a href="/legales/privacidad" className="underline hover:text-black dark:hover:text-white">
          Política de Privacidad
        </a>
      </p>
      <p className="mt-1">© {new Date().getFullYear()} SRTienda - San Rafael</p>
    </footer>
  );
}