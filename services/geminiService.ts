import { GoogleGenAI, Type } from '@google/genai';
import { Holiday, SchoolHolidayPeriod } from '../types';

// FIX: Initialize GoogleGenAI client according to coding guidelines by using API key directly from environment variables without fallbacks.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const holidaySchema = {
  type: Type.OBJECT,
  properties: {
    publicHolidays: {
      type: Type.ARRAY,
      description: 'Eine Liste der gesetzlichen Feiertage.',
      items: {
        type: Type.OBJECT,
        properties: {
          date: {
            type: Type.STRING,
            description: 'Datum des Feiertags im Format YYYY-MM-DD.',
          },
          name: { type: Type.STRING, description: 'Name des Feiertags.' },
        },
        required: ['date', 'name'],
      },
    },
    schoolHolidays: {
      type: Type.ARRAY,
      description: 'Eine Liste der Schulferien.',
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: 'Name der Ferien (z.B. Osterferien).',
          },
          startDate: {
            type: Type.STRING,
            description: 'Startdatum der Ferien im Format YYYY-MM-DD.',
          },
          endDate: {
            type: Type.STRING,
            description: 'Enddatum der Ferien im Format YYYY-MM-DD.',
          },
        },
        required: ['name', 'startDate', 'endDate'],
      },
    },
  },
  required: ['publicHolidays', 'schoolHolidays'],
};

export const fetchHolidaysForRLP = async (
  year: number
): Promise<{
  publicHolidays: Holiday[];
  schoolHolidays: SchoolHolidayPeriod[];
}> => {
  try {
    const prompt = `Erstelle eine JSON-Antwort mit allen gesetzlichen Feiertagen und Schulferien für das Bundesland Rheinland-Pfalz in Deutschland für das Jahr ${year}. Schließe Wochenenden (Samstag, Sonntag) aus den Zeiträumen der Schulferien aus, liste aber die Feiertage auf, auch wenn sie auf ein Wochenende fallen. Die Antwort muss ausschließlich ein gültiges JSON-Objekt sein, das dem bereitgestellten Schema entspricht.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: holidaySchema,
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);

    return {
      publicHolidays: data.publicHolidays || [],
      schoolHolidays: data.schoolHolidays || [],
    };
  } catch (error) {
    console.error('Fehler beim Abrufen der Feiertagsdaten von Gemini:', error);
    // Return empty arrays as a fallback
    return { publicHolidays: [], schoolHolidays: [] };
  }
};
