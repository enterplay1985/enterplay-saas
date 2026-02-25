// src/lib/googleSheets.ts
export async function fetchTableData(tableName: string) {
  const SCRIPT_URL = process.env.NEXT_PUBLIC_SCRIPT_URL;
  
  if (!SCRIPT_URL) {
    console.error("❌ ERROR: La URL del Script no está definida en .env.local");
    return [];
  }

  try {
    // IMPORTANTE: Agregamos action=get_data para que el Wizard 0.4 sepa qué hacer
    const response = await fetch(`${SCRIPT_URL}?action=get_data&table=${tableName}`, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) throw new Error("Error en la respuesta del servidor");
    
    return await response.json();
  } catch (error) {
    console.error("❌ Error en fetchTableData:", error);
    return [];
  }
}