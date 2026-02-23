import Airtable from "airtable";

const apiKey = process.env.AIRTABLE_TOKEN || process.env.AIRTABLE_ACCESS_TOKEN;
const baseId = process.env.AIRTABLE_BASE_ID;

export const airtableBase = new Airtable({ apiKey }).base(baseId ?? "");

export async function getAirtableUserByEmail(email: string) {
  try {
    // Buscamos en la tabla 'Users' (ajusta si se llama 'Usuarios')
    const records = await airtableBase("Users").select({
      filterByFormula: `{Email} = '${email}'`,
      maxRecords: 1
    }).firstPage();

    if (records.length > 0) {
      const r = records[0];
      return {
        id: r.id,
        clientId: r.fields.ClientID as string,
        credits: Number(r.fields.Credits || 0),
        role: r.fields.Role as string
      };
    }
    return null;
  } catch (error) {
    console.error("Error buscando en Airtable:", error);
    return null;
  }
}

export async function createAirtableUser(user: { email: string; name: string }) {
  try {
    const newRecords = await airtableBase("Users").create([
      {
        fields: {
          "Name": user.name,
          "Email": user.email,
          "Credits": 3, // Regalo inicial
          "Role": "User",
          "ClientID": `USR-${Math.floor(100 + Math.random() * 899)}`
        }
      }
    ]);
    const r = newRecords[0];
    return {
      id: r.id,
      clientId: r.fields.ClientID as string,
      credits: 3,
      role: "User"
    };
  } catch (error) {
    console.error("Error creando en Airtable:", error);
    return null;
  }
}