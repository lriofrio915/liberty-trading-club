// app/cot-analysis/page.tsx
"use client"; // Este componente de página será un Client Component

import React from "react";
import CotDataTable from "../../components/CotDataTable"; // Asegúrate de que la ruta de importación sea correcta

export default function CotAnalysisPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <CotDataTable />
    </div>
  );
}
