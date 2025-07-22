import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // domains: ['i.ibb.co'], // Esta línea es la que está deprecada y la vamos a reemplazar
    remotePatterns: [
      {
        protocol: 'https', // Especifica el protocolo (http, https)
        hostname: 'i.ibb.co', // El dominio de la imagen
        port: '', // Si la imagen usa un puerto específico, déjalo vacío si no
        pathname: '/**', // Permite cualquier ruta dentro de ese dominio. Puedes ser más específico si lo necesitas.
      },
    ],
  },
};

export default nextConfig;