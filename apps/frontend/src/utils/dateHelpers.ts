// DATA HELPERS

// Parses a date string in different formats to a Date object
export function parseDate(dateString: string): Date {
  const cleanDate = dateString.trim();

  // Try multiple formats
  const formats = [
    // YYYY-MM-DD (ISO format)
    () => {
      const parts = cleanDate.split("-");
      if (parts.length === 3 && parts[0].length === 4) {
        // Use Date.UTC to avoid timezone issues
        const year = Number(parts[0]);
        const month = Number(parts[1]) - 1; // mounth is 0-indexed
        const day = Number(parts[2]);
        return new Date(year, month, day);
      }
      return null;
    },
    // DD-MM-YYYY
    () => {
      const parts = cleanDate.split("-");
      if (parts.length === 3 && parts[0].length <= 2) {
        return new Date(
          Number(parts[2]),
          Number(parts[1]) - 1,
          Number(parts[0])
        );
      }
      return null;
    },
    // DD/MM/YYYY
    () => {
      const parts = cleanDate.split("/");
      if (parts.length === 3) {
        return new Date(
          Number(parts[2]),
          Number(parts[1]) - 1,
          Number(parts[0])
        );
      }
      return null;
    },
    // Direct ISO format
    () => {
      const date = new Date(cleanDate);
      return !isNaN(date.getTime()) ? date : null;
    },
  ];

  for (const format of formats) {
    const date = format();
    if (date && !isNaN(date.getTime())) {
      return date;
    }
  }

  console.error("Não foi possível parsear a data:", dateString);
  return new Date(); // Fallback to today
}

// Portuguese abbreviated day names
export const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

// Portuguese full day names
export const DAY_NAMES_FULL = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

// Get abbreviated day name
export function getDayName(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseDate(date) : date;
  return DAY_NAMES[dateObj.getDay()];
}

// Get full day name
export function getDayNameFull(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseDate(date) : date;
  return DAY_NAMES_FULL[dateObj.getDay()];
}
