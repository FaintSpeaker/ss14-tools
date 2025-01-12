import {DetailedViolation, Violation, ViolationGroup, ViolationModifierGroup} from "../../types/SpaceLaw";

export const MAXIMUM_SENTENCE = 25;

function renderViolationText(violation: DetailedViolation) {
    const counts = (violation.counts > 1) ? `${violation.counts}x` : "";
    const remarks = violation.notes ? `(${violation.notes})` : "";
    const title = BuildViolationTitle(violation);

    const text = `${counts} ${title} ${remarks}`.trim();

    return ` ◦ ${text}`;
}

export function BuildViolationTitle(violation: DetailedViolation) {
    let prefix = "";
    let suffix = "";

    if (violation.modifier) {
        prefix = violation.modifier.prefix ?? "";
        suffix = violation.modifier.suffix ?? "";
    }

    const title = `${prefix}${violation.title}${suffix}`.trim();

    return `${violation.code} - ${title}`;
}

export async function FetchLaws(source: "delta-v" = "delta-v"): Promise<ViolationGroup[]> {
    const url = `/${source}/space-law/laws.json`;
    const res: Response = await fetch(url);
    return await res.json();
}

export async function FetchLawModifiers(source: "delta-v" = "delta-v"): Promise<ViolationModifierGroup[]> {
    const url = `/${source}/space-law/modifiers.json`;
    const res: Response = await fetch(url);
    return await res.json();
}

export function sortViolations(left: Violation, right: Violation) {
    // sort code descending
    return right.code - left.code;
}

export function crunchViolations(violations: DetailedViolation[]) {

    const formattedText = violations.sort(sortViolations).map(renderViolationText).join("\n");
    const totalSentence = violations.reduce((total, violation) => total + (violation.sentence * (violation.counts ?? 1)), 0);
    const isCapital = violations.some((v) => v.isCapital);
    const requiresTrial = isCapital || totalSentence > MAXIMUM_SENTENCE;

    return {
        formattedText,
        totalSentence,
        isCapital,
        requiresTrial
    }
}