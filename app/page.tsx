import Image from "next/image";

export const metadata = {
  title: "Inicio - Emporium Quality Funds",
  description:
    "Descubre la transparencia y el éxito comprobado de las estrategias de trading de Emporium Quality Funds.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col items-center p-5 bg-gray-50 text-gray-700 min-h-screen">
      <div className="w-full max-w-7xl mx-auto mt-10">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 relative text-center max-w-3xl mx-auto">
          <div className="flex flex-col items-center justify-center mb-4">
            <Image
              src="https://i.ibb.co/20RsFG5H/emporium-logo-1.jpg"
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
            Desde el departamento macroeconómico de Emporium Quality Funds, te
            presentamos la transparencia y la excelencia de nuestras estrategias
            de trading. Todos nuestros resultados están respaldados por{" "}
            <span className="font-bold text-[#0A2342]">
              track records comprobados.
            </span>
          </p>
          <p className="text-justify text-gray-700 text-sm md:text-base mx-auto">
            Te invitamos a navegar y conocer de cerca cómo operamos, con la
            confianza de que la información que presentamos es un reflejo fiel
            de nuestro compromiso con nuestros clientes y la calidad de nuestra
            metodología.
          </p>
        </div>
      </div>
    </div>
  );
}
