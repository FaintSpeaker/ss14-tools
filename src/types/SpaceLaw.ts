export type Violation = {
    code: number;
    description: string;
    isCapital: boolean;
    minutes: number;
    minutesMax?: number;
    severity: "Misdemeanor" | "Felony" | "Grand Felony" | "Capital";
    title: string;
    useCustomMinutes: boolean;
}

export type DetailedViolation = Violation & {
    uuid: string;
    counts: number;
    modifier?: ViolationModifier;
    notes?: string;
    sentence: number;
}

export type ViolationModifier = {
    description: string;
    type: "Aggravating" | "Extenuating"
    name: string;
    perCrime: boolean;
    prefix?: string;
    suffix?: string;
    timeMultiplier?: number;
    canWaive?: boolean;
}

export type ViolationGroup = {
    category: string;
    colour: string;
    violations: Violation[];
}

export type ViolationModifierGroup = {
    category: string;
    modifiers: ViolationModifier[];
}

export type ArrestDetails = {
    arrestee: string;
    arrestingOfficer: string;
}