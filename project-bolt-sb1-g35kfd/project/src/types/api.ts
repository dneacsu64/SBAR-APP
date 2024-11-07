export interface SBARReport {
  situation: {
    patientInfo: string;
    allergies: string;
    codeStatus: string;
    admittingDiagnosis: string;
  };
  background: {
    presentIllness: string;
    pastHistory: string;
    medications: string;
    vitalSigns: string;
  };
  assessment: {
    neurological: string;
    cardiovascular: string;
    respiratory: string;
    gastrointestinal: string;
    genitourinary: string;
    musculoskeletal: string;
    skin: string;
    labsAndDiagnostics: string;
    linesAndDrains: string;
    therapies: string;
    isolationStatus: string;
    fallRisk: string;
  };
  recommendation: {
    planOfCare: string;
  };
}

export interface APIError {
  message: string;
  code?: string;
  status?: number;
}