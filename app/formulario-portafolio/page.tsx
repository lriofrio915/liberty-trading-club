"use client";

import React, { useState } from "react";

// Interfaces de TypeScript para la estructura del formulario
interface ContactFormState {
  tratamiento: string;
  nombre: string;
  segundoNombre: string;
  apellidos: string;
  direccionLinea1: string;
  direccionLinea2: string;
  ciudad: string;
  estadoProvincia: string;
  codigoPostal: string;
  telefonoTipo: string;
  telefonoUbicacion: string;
  numeroTelefono: string;
}

const estadoProvincias = [
  "Azuay",
  "Bolívar",
  "Carchi",
  "Chimborazo",
  "Cotopaxi",
  "Cáñar",
  "El Oro",
  "Esmeraldas",
  "Galápagos",
  "Guayas",
  "Imbabura",
  "Loja",
  "Los Ríos",
  "Manabi",
  "Morona-Santiago",
  "Napo",
  "Orellana",
  "Pastaza",
  "Pichincha",
  "Santa Elena",
  "Santo Domingo de los Tsechilas",
  "Sucumbios",
  "Tungurahua",
  "Zamora Chinchipe",
];

const tiposTelefono = [
  "Domicilio",
  "Trabajo",
  "Móvil",
  "Negocios",
  "Fax",
  "Otros (voz)",
];

const paises = [
  "Albania",
  "Alemania",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antártida",
  "Antigua y Barbuda",
  "Arabia Saudita",
  "Argelia",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaiyán",
  "Bahamas",
  "Bangladés",
  "Barbados",
  "Baréin",
  "Bélgica",
  "Belice",
  "Benin",
  "Bermudas",
  "Bhután",
  "Bolivia",
  "Bonaire, San Eustaquio y Saba",
  "Bosnia y Herzegovina",
  "Botsuana",
  "Brasil",
  "Brunéi Darusalam",
  "Bulgaria",
  "Burkina Faso",
  "Cabo Verde",
  "Camboya",
  "Camerún",
  "Canadá",
  "Chad",
  "Chile",
  "China",
  "Chipre",
  "Colombia",
  "Comoras",
  "Costa de Marfil",
  "Costa Rica",
  "Croacia",
  "Curaçao",
  "Dominica",
  "Ecuador",
  "Egipto",
  "El Salvador",
  "Emiratos Árabes Unidos",
  "Eritrea",
  "Eslovaquia",
  "Eslovenia",
  "España",
  "Estados Unidos",
  "Estonia",
  "Etiopía",
  "Federación de Rusia",
  "Fiji",
  "Filipinas",
  "Finlandia",
  "Francia",
  "Gabón",
  "Gambia",
  "Georgia",
  "Ghana",
  "Gibraltar",
  "Granada",
  "Grecia",
  "Groenlandia",
  "Guadalupe",
  "Guam",
  "Guatemala",
  "Guayana Francesa",
  "Guernsey",
  "Guinea",
  "Guinea Bissau",
  "Guinea Ecuatorial",
  "Guyana",
  "Haití",
  "Honduras",
  "Hungría",
  "India",
  "Indonesia",
  "Irlanda",
  "Isla de Man",
  "Isla de Norfolk",
  "Islandia",
  "Islas Aland",
  "Islas Caimán",
  "Islas Cook",
  "Islas del Canal y Jersey",
  "Islas Feroe",
  "Islas Malvinas",
  "Islas Marianas septentrionales",
  "Islas Marshall",
  "Islas Salomón",
  "Islas Svalbard y Jan Mayen",
  "Islas Turcas y Caicos",
  "Islas Ultramarinas Menores de Estados Unidos",
  "Islas Vírgenes Británicas",
  "Islas Vírgenes de los Estados Unidos",
  "Italia",
  "Jamaica",
  "Jordania",
  "Kazajistán",
  "Kenya",
  "Kirguistán",
  "Kiribati",
  "Kósovo",
  "Kuwait",
  "Lesotho",
  "Letonia",
  "Líbano",
  "Liberia",
  "Liechtenstein",
  "Lituania",
  "Luxemburgo",
  "Macedonia",
  "Madagascar",
  "Malasia",
  "Malawi",
  "Maldivas",
  "Mali",
  "Malta",
  "Marruecos",
  "Martinica",
  "Mauricio",
  "Mauritania",
  "Mayotte",
  "México",
  "Micronesia (Estados Federados de)",
  "Mónaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Mozambique",
  "Namibia",
  "Nepal",
  "Nicaragua",
  "Niger",
  "Niue",
  "Noruega",
  "Nueva Caledonia",
  "Nueva Zelanda",
  "Omán",
  "Países Bajos",
  "Pakistán",
  "Palau",
  "Panamá",
  "Papua Nueva Guinea",
  "Paraguay",
  "Perú",
  "Pitcairn",
  "Polinesia Francesa",
  "Polonia",
  "Puerto Rico",
  "Qatar",
  "Región administrativa especial de Hong Kong",
  "Región administrativa especial de Macao",
  "Reino Unido",
  "República Checa",
  "República de Corea",
  "República Democrática Popular Lao",
  "República de Moldova",
  "República Dominicana",
  "República Unida de Tanzanía",
  "Reunion",
  "Rumania",
  "Rwanda",
  "Sáhara Occidental",
  "Saint Kitts y Nevis",
  "Saint Martin",
  "Saint-Pierre y Miquelon",
  "Samoa",
  "Samoa Americana",
  "San Bartolomé",
  "San Marino",
  "Santa Elena",
  "Santa Lucía",
  "Santa sede",
  "Santo Tomé y Príncipe",
  "San Vicente y las Granadinas",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Singapur",
  "Sint Maarten",
  "Sri Lanka",
  "Suazilandia",
  "Sudáfrica",
  "Suecia",
  "Suiza",
  "Suriname",
  "Tailandia",
  "Taiwán",
  "Tayikistán",
  "Territorio Británico del Océano Índico",
  "Territorios ocupados Palestinos",
  "Timor-Leste",
  "Togo",
  "Tokelau",
  "Tonga",
  "Trinidad y Tobago",
  "Túnez",
  "Turkmenistán",
  "Turquía",
  "Tuvalu",
  "Ucrania",
  "Uganda",
  "Uruguay",
  "Uzbekistán",
  "Vanuatu",
  "Vietnam",
  "Wallis y Futuna",
  "Yibuti",
  "Zambia",
];

const InvestorForm = () => {
  const [formData, setFormData] = useState<ContactFormState>({
    tratamiento: "",
    nombre: "",
    segundoNombre: "",
    apellidos: "",
    direccionLinea1: "",
    direccionLinea2: "",
    ciudad: "",
    estadoProvincia: "",
    codigoPostal: "",
    telefonoTipo: "",
    telefonoUbicacion: "",
    numeroTelefono: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    alert(
      "Formulario enviado. Por favor, revise la consola para ver los datos."
    );
    // Aquí podrías agregar la lógica para enviar los datos a un servidor
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-4">
          ¡Bienvenidos!
        </h1>
        <p className="text-center text-lg text-gray-600 mb-8">
          A continuación, vamos a iniciar el proceso para gestionar su capital.
          Nuestro plan consiste en **abrir una cuenta en Interactive Brokers**,
          armar un **portafolio diversificado** y, finalmente, **comprar
          acciones, bonos y ETFs** para maximizar su inversión.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-gray-900/10 pb-8">
            <h2 className="text-2xl font-semibold leading-7 text-gray-900">
              Acerca de usted
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Información de contacto
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Indique su nombre según aparece en su documento de identidad
              emitido por el gobierno.
            </p>

            {/* Tratamiento */}
            <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
              <div className="col-span-full">
                <label
                  htmlFor="tratamiento"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Trato
                </label>
                <select
                  id="tratamiento"
                  name="tratamiento"
                  value={formData.tratamiento}
                  onChange={handleChange}
                  required
                  className="mt-2 block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="">Choose (Required)</option>
                  <option>Sr.</option>
                  <option>Sra.</option>
                  <option>Srta.</option>
                  <option>Dr.</option>
                  <option>Mx.</option>
                  <option>Ind.</option>
                  <option>Ninguna de estas opciones se aplican para mí.</option>
                </select>
              </div>

              {/* Nombre */}
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Nombre
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Segundo Nombre */}
              <div>
                <label
                  htmlFor="segundoNombre"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Segundo nombre
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="segundoNombre"
                    id="segundoNombre"
                    value={formData.segundoNombre}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Apellidos */}
              <div className="col-span-full">
                <label
                  htmlFor="apellidos"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Apellidos
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="apellidos"
                    id="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Dirección */}
              <div className="col-span-full">
                <label
                  htmlFor="direccionLinea1"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Línea 1 de la dirección
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="direccionLinea1"
                    id="direccionLinea1"
                    value={formData.direccionLinea1}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="direccionLinea2"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Línea 2 de la dirección
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="direccionLinea2"
                    id="direccionLinea2"
                    value={formData.direccionLinea2}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Ciudad y Estado/Provincia */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="ciudad"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Ciudad
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="ciudad"
                    id="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="estadoProvincia"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Estado o provincia
                </label>
                <select
                  id="estadoProvincia"
                  name="estadoProvincia"
                  value={formData.estadoProvincia}
                  onChange={handleChange}
                  required
                  className="mt-2 block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="">Choose (Required)</option>
                  {estadoProvincias.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>

              {/* Código Postal */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="codigoPostal"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Código postal
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="codigoPostal"
                    id="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div className="col-span-full mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <label
                      htmlFor="telefonoTipo"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Tipo de número de teléfono
                    </label>
                    <select
                      id="telefonoTipo"
                      name="telefonoTipo"
                      value={formData.telefonoTipo}
                      onChange={handleChange}
                      required
                      className="mt-2 block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option value="">Choose (Required)</option>
                      {tiposTelefono.map((tipo) => (
                        <option key={tipo} value={tipo}>
                          {tipo}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="telefonoUbicacion"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Ubicación
                    </label>
                    <select
                      id="telefonoUbicacion"
                      name="telefonoUbicacion"
                      value={formData.telefonoUbicacion}
                      onChange={handleChange}
                      required
                      className="mt-2 block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option value="">Choose (Required)</option>
                      {paises.map((pais) => (
                        <option key={pais} value={pais}>
                          {pais}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="numeroTelefono"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Número de teléfono
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="numeroTelefono"
                        id="numeroTelefono"
                        value={formData.numeroTelefono}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Enviar Formulario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestorForm;
