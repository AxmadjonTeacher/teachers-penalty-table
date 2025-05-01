
// Type definitions for grade storage
export type GradesState = {
  [studentId: number]: {
    [dateIdx: number]: string[]
  }
};

export type DatesState = (Date | null)[];

// Save grades to localStorage
export const saveGrades = (teacherId: string, groupTitle: string, grades: GradesState): void => {
  const key = `grades_${teacherId}_${groupTitle}`;
  localStorage.setItem(key, JSON.stringify(grades));
};

// Load grades from localStorage
export const loadGrades = (teacherId: string, groupTitle: string): GradesState => {
  const key = `grades_${teacherId}_${groupTitle}`;
  const saved = localStorage.getItem(key);
  
  if (saved) {
    const parsed = JSON.parse(saved);
    
    // Convert date strings back to Date objects if needed
    return parsed;
  }
  
  return {};
};

// Save dates to localStorage
export const saveDates = (teacherId: string, groupTitle: string, dates: DatesState): void => {
  const key = `dates_${teacherId}_${groupTitle}`;
  // Convert Date objects to strings for storage
  const datesForStorage = dates.map(date => date ? date.toISOString() : null);
  localStorage.setItem(key, JSON.stringify(datesForStorage));
};

// Load dates from localStorage
export const loadDates = (teacherId: string, groupTitle: string): DatesState => {
  const key = `dates_${teacherId}_${groupTitle}`;
  const saved = localStorage.getItem(key);
  
  if (saved) {
    const parsed = JSON.parse(saved);
    // Convert strings back to Date objects
    return parsed.map((dateStr: string | null) => dateStr ? new Date(dateStr) : null);
  }
  
  return [null, null, null, null, null];
};

// Save notes to localStorage
export const saveNotes = (teacherId: string, groupTitle: string, notes: string): void => {
  const key = `notes_${teacherId}_${groupTitle}`;
  localStorage.setItem(key, notes);
};

// Load notes from localStorage
export const loadNotes = (teacherId: string, groupTitle: string): string => {
  const key = `notes_${teacherId}_${groupTitle}`;
  return localStorage.getItem(key) || "";
};
