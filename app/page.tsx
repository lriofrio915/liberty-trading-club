import Image from "next/image";

export const metadata = {
  title: "Inicio - Emporium Quality Funds",
  description:
    "Descubre la transparencia y el éxito comprobado de las estrategias de trading de Emporium Quality Funds.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col items-center p-5 bg-white text-gray-700 min-h-screen">
      <div className="w-full max-w-7xl mx-auto mt-10">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 relative text-center max-w-3xl mx-auto">
          <div className="flex flex-col items-center justify-center mb-4">
            {/* Using the new image for the logo */}
            <Image
              src="https://i.ibb.co/20RsFG5H/emporium-logo-1.jpg" // Placeholder for the new image, replace with actual URL if available
              alt="Emporium Quality Funds Logo"
              className="w-20 h-20 rounded-full object-cover border-2 border-[#0A2342] shadow-md mb-3"
              width={80}
              height={80}
            />
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#0A2342] mb-1">
              Bienvenido a Emporium Quality Funds
            </h1>
            <p className="text-md md:text-lg text-[#849E8F]">
              Tu portal de transparencia en trading y estrategias validadas.
            </p>
          </div>
          <p className="text-justify text-gray-700 text-sm md:text-base mb-3 mx-auto">
            Desde el departamento macroeconómico de Emporium, te
            presentamos la transparencia y la excelencia de nuestras estrategias
            de trading. Todos nuestros resultados están respaldados por{" "}
            <span className="font-bold text-[#0A2342]">
              track records comprobados.
            </span>
          </p>
          <p className="text-justify text-gray-700 text-sm md:text-base mx-auto mb-6">
            Te invitamos a navegar y conocer de cerca cómo operamos, con la
            confianza de que la información que presentamos es un reflejo fiel
            de nuestro compromiso con nuestros clientes y la calidad de nuestra
            metodología.
          </p>

          {/* New button section based on the image */}
          <button className="px-8 py-3 bg-[#849E8F] text-white font-semibold rounded-full shadow-lg hover:bg-[#6C8476] transition duration-300 ease-in-out">
            EXPLORA NUESTRAS ESTRATEGIAS
          </button>
        </div>
      </div>
    </div>
  );
}
