import {
    DetailedViolation,
    Violation,
    ViolationGroup,
    ViolationModifier,
    ViolationModifierGroup
} from "../../types/SpaceLaw";
import classNames from "classnames";
import {v4 as uuidv4} from "uuid";
import {useEffect, useState} from "react";
import {BuildViolationTitle, FetchLawModifiers, FetchLaws} from "./SpaceLaw.ts";
import SelectSkeleton from "../../shared/skeleton/loading/SelectSkeleton.tsx";
import FormFieldContainer from "../../shared/elements/form/FormFieldContainer.tsx";
import Message from "../../shared/elements/Message.tsx";

export function ViolationSelector({onChange, curViolation, source, disabled}: {
    onChange?: (violation: Violation) => void, curViolation?: Violation, source?: "delta-v", disabled?: boolean
}) {
    source ??= "delta-v";

    const [lawData, setLawData] = useState<ViolationGroup[]>();

    useEffect(() => {
        let ignore = false;

        if (ignore) return;
        FetchLaws(source)
            .then()
            .then((data) => {
                if (ignore) return;
                setLawData(data);
            });

        return () => {
            ignore = true;
        }
    }, [source]);

    if (!lawData) return (<SelectSkeleton type={"loading"} loadingMessage={"Loading Space Law..."} />);

    return (<div className="select is-fullwidth">
        <select disabled={disabled} value={curViolation?.code ?? -1} onChange={(e) => {
            const code = Number(e.target.value);
            const violation = lawData.flatMap(vg => vg.violations).find((violation) => violation.code === code);
            if (violation) {
                onChange?.(violation);
            }
        }}>
            <option key={-1} value="-1">Select violation...</option>
            {lawData.map((group) => <optgroup key={group.category} title={group.category} label={group.category}>
                {group.violations.map((violation) => (<option key={violation.code}
                                                              value={violation.code}>{violation.code} - {violation.title}</option>))}
            </optgroup>)}
        </select>
    </div>);
}

export function ViolationModifierSelector({source, onChange, selectedModifier, disabled}: {
    source?: "delta-v",
    onChange?: (modifier?: ViolationModifier) => void,
    selectedModifier?: ViolationModifier,
    disabled?: boolean
}) {
    source ??= "delta-v";
    disabled ??= false;

    const [modifierData, setModifierData] = useState<ViolationModifierGroup[]>();

    useEffect(() => {
        let ignore = false;

        FetchLawModifiers(source)
            .then((data) => {
                if (ignore) return;
                setModifierData(data);
            });

        return () => {
            ignore = true;
        }
    }, [source]);

    if (!modifierData) return (<SelectSkeleton type={"loading"} loadingMessage={"Loading Modifiers..."} />);

    return (
        <div className={"field"}>
            <div className={"select is-fullwidth"}>
                <select disabled={disabled} onChange={(v) => {
                    const modifier = modifierData?.flatMap(group => group.modifiers).find(mod => mod.name === v.target.value);
                    onChange?.(modifier);
                }} value={selectedModifier?.name ?? "-1"}>
                    <option value={"-1"}>No Modifier</option>
                    {modifierData.map(group => {
                        return (<optgroup label={group.category} key={group.category}>
                                {group.modifiers.map((modifier) => {
                                    return (<option key={modifier.name} value={modifier.name}>
                                        {modifier.name}
                                    </option>)
                                })}
                            </optgroup>)
                    })}
                </select>
            </div>
        </div>
    );
}

export function ViolationDetails({violation}: { violation: DetailedViolation }) {
    return (
        <div className={"block"}>
            <div>
                <div className={"block"}>
                    <h3 className={"title is-3"}>{BuildViolationTitle(violation)}</h3>
                    <p>{violation.description}</p>
                </div>
                {violation.modifier &&<div className={"block"}>
                    <h4 className={"subtitle is-4"}>{violation.modifier.name}</h4>
                    <p>{violation.modifier.description}</p>
                </div>}
            </div>
        </div>
    )
}

export function SentenceReducedTag() {
    return (<span className={"tag is-success is-light ml-1"}>Sentence reduced</span>)
}

export function SentenceIncreasedTag() {
    return (<span className={"tag is-danger is-light ml-1"}>Sentence increased</span>)
}

export function CapitalSentenceTag(){
    return (<span className={"tag is-danger ml-1"}>Capital Offense</span>)
}

export function ViolationSentenceTags({violation}: { violation: DetailedViolation }) {
    return (<>
        {violation.isCapital && <CapitalSentenceTag />}
        {(violation.minutesMax ?? violation.minutes) < violation.sentence && <SentenceIncreasedTag />}
        {violation.minutes > violation.sentence && <SentenceReducedTag />}
    </>);
}

export function ViolationSentenceView({violation, tagged, labeled}: { violation: DetailedViolation, tagged?: boolean, labeled?: boolean }) {
    return (
        <>
            {labeled && <strong>Sentence: </strong>}
            {!violation.isCapital && <span>{violation.sentence} Minutes</span>}
            {tagged && <ViolationSentenceTags violation={violation}/>}
        </>
    );
}

export function ViolationBuilder({onChange, onSubmit, pendingViolation, active, onCancel, editMode}: {
    onChange?: (violation: DetailedViolation) => void,
    onSubmit?: () => void,
    onCancel?: () => void,
    pendingViolation?: DetailedViolation,
    active: boolean,
    editMode: boolean
}) {
    const useCustomMinutes = pendingViolation?.useCustomMinutes || (pendingViolation?.modifier?.timeMultiplier !== undefined);

    const minimumSentence = Math.floor((pendingViolation?.minutes ?? 1) * Math.min(pendingViolation?.modifier?.timeMultiplier ?? 1, 1));
    const maximumSentence = Math.ceil((pendingViolation?.minutesMax ?? pendingViolation?.minutes ?? 1) * Math.max(pendingViolation?.modifier?.timeMultiplier ?? 1, 1));

    return (<div className={classNames("modal", {"is-active": active})}>
        <div className={"modal-background"}/>
        <div className={"modal-card"}>
            <div className={"modal-card-head"}>
                <h2 className={"modal-card-title"}>Criminal Charge Builder</h2>
                <button className="delete" aria-label="close" onClick={onCancel}></button>
            </div>
            <section className={"modal-card-body"}>
                <div className={"columns is-multiline"}>
                    <div className={"column is-four-fifths"}>
                        <FormFieldContainer label={"Violation"}>
                            <ViolationSelector disabled={editMode}
                                               onChange={(v) => onChange?.({
                                                   ...v,
                                                   uuid: uuidv4(),
                                                   counts: 1,
                                                   sentence: v.minutes
                                               })}
                                               curViolation={pendingViolation}/>
                        </FormFieldContainer>
                    </div>

                    <div className={"column is-one-fifth"}>
                        <FormFieldContainer label={"Counts"}>
                            <input type={"number"}
                                   disabled={!pendingViolation}
                                   className={"input"}
                                   value={pendingViolation?.counts ?? 1}
                                   min={1}
                                   onChange={(v) => onChange?.({
                                       ...pendingViolation!, counts: Number(v.target.value) || 1
                                   })}
                            />
                        </FormFieldContainer>
                    </div>

                    <div className={"column is-half"}>
                        <FormFieldContainer label={"Modifier"}>
                            <ViolationModifierSelector
                                disabled={!pendingViolation}
                                onChange={(modifier) => {
                                    onChange?.({
                                        ...pendingViolation!, modifier: modifier, sentence: pendingViolation!.minutes
                                    });
                                }}
                                selectedModifier={pendingViolation?.modifier}
                            />
                        </FormFieldContainer>
                    </div>

                    <div className={"column is-half"}>
                        <FormFieldContainer label={"Remarks"}>
                            <input type={"text"}
                                   disabled={!pendingViolation}
                                   className={"input"}
                                   value={pendingViolation?.notes ?? ""}
                                   onChange={(v) => onChange?.({...pendingViolation!, notes: v.target.value})}/>
                        </FormFieldContainer>
                    </div>

                    <div className={"column is-fullwidth"}>
                        <FormFieldContainer label={"Sentence"} className={"is-fullwidth"}>
                            {!pendingViolation &&
                                <Message info>
                                    <Message.Body>Select a violation to see the sentence.</Message.Body>
                                </Message>
                            }
                            {(pendingViolation && useCustomMinutes) &&
                                <div className={"control is-fullwidth"}>
                                    <input type={"range"}
                                           className={"slider is-fullwidth"}
                                           disabled={!useCustomMinutes}
                                           step={1}
                                           min={minimumSentence}
                                           max={maximumSentence}
                                           value={pendingViolation.sentence}
                                           onChange={(v) => onChange?.({
                                               ...pendingViolation!,
                                               sentence: Number(v.target.value)
                                           })}
                                    />
                                </div>
                            }
                            <p className={"block"}>
                                {pendingViolation && <ViolationSentenceView violation={pendingViolation} tagged/>}
                            </p>
                        </FormFieldContainer>
                    </div>
                </div>
                {pendingViolation && <ViolationDetails violation={pendingViolation}/>}
            </section>
            <section className={"modal-card-foot"}>
                <div className={"buttons"}>
                    <button type="button" className="button is-success"
                            onClick={onSubmit}>{editMode ? "Save" : "Create"}</button>
                    <button type="button" className="button is-danger" onClick={onCancel}>Cancel</button>
                </div>
            </section>
        </div>
    </div>);
}