import {crunchViolations} from "./SpaceLaw.ts";
import {ArrestDetails, DetailedViolation} from "../../types/SpaceLaw";

import {DefaultErrorBoundary} from "../../shared/elements/ErrorView.tsx";

import {useContext, useEffect, useState} from "react";

import {TitleData} from "../../types/Site";

import {ViolationBuilder} from "./ViolationBuilder.tsx";
import {NewspaperIcon, PlusCircleIcon, PrinterIcon, TrashIcon as TrashIcon24} from "@heroicons/react/24/outline";
import DocumentRenderer from "../../shared/templates/DocumentRenderer.tsx";
import {ArrestDetailsView} from "./ArrestDetailsView.tsx";
import {TitleContext} from "../../shared/context/Contexts.ts";

const title: TitleData = {
    title: "Arrest Report Builder", subtitle: "Brig Time Calculator Included!",
}

const defaultDocParams: Record<string, string> = {
    "title": "Arrest Report", "subtitle": "", "documentColor": "#cb0000",
}

export default function ArrestReportBuilder() {

    const [violations, setViolations] = useState<DetailedViolation[]>([]);
    const [pendingViolation, setPendingViolation] = useState<DetailedViolation>();

    const [violationBuilderActive, setViolationBuilderActive] = useState(false);
    const [isViolationBuilderEditor, setIsViolationBuilderEditor] = useState(false);
    const [documentPreview, setDocumentPreview] = useState(true);
    const [arrestDetails, setArrestDetails] = useState<ArrestDetails>({arrestingOfficer:"", arrestee: ""});

    const {setTitle} = useContext(TitleContext);

    useEffect(() => {
        setTitle(title)
    }, [setTitle]);

    function showViolationBuilder(editMode: boolean, violation?: DetailedViolation) {
        setPendingViolation(violation);
        setIsViolationBuilderEditor(editMode);
        setViolationBuilderActive(true);
    }

    function closeViolationBuilder() {
        setPendingViolation(undefined);
        setViolationBuilderActive(false);
    }

    function resetForm() {
        setViolations([]);
        closeViolationBuilder();
        setIsViolationBuilderEditor(false);
    }

    const {formattedText, totalSentence, isCapital, requiresTrial} = crunchViolations(violations);

    return (<>
        <div className={"columns is-desktop"}>
            <div className={"column"}>
                <div className={"block"}>
                    <div className={"card"}>
                        <div className={"card-header"}>
                            <h1 className={"card-header-title"}>
                                <span>Arrest Report</span>
                            </h1>
                            <a className={"button has-text-danger-bold is-ghost"} onClick={resetForm}>
                                <span>Reset</span>
                                <span className={"icon"}><TrashIcon24/></span>
                            </a>
                        </div>
                        <div className={"card-content"}>
                            <div className={"container"}>
                                <DefaultErrorBoundary title={"Failed to render Arrest Details."}>
                                    <ArrestDetailsView violations={violations}
                                                       arrestDetails={arrestDetails}
                                                       onArrestDetailsChange={setArrestDetails}
                                                       onViolationEdit={(violation) => {
                                                           showViolationBuilder(true, violation);
                                                       }}
                                                       onViolationDelete={(violation) => {
                                                           setViolations(violations.filter(v => v.uuid !== violation.uuid));
                                                       }}/>
                                </DefaultErrorBoundary>
                            </div>
                        </div>
                        <div className={"card-footer"}>
                            <button className="card-footer-item" onClick={() => {
                                showViolationBuilder(false);
                            }}>
                                <span className={"icon"}><PlusCircleIcon/></span>
                                <span>Add Crime</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"column is-narrow"}>
                <div className={"card"}>
                    <div className={"card-header"}>
                        <div className={"card-header-title"}>
                            Document Preview
                        </div>
                        <button className={"button is-ghost has-text-black"}
                                onClick={() => setDocumentPreview(!documentPreview)}>
                            {!documentPreview &&
                                <>
                                    <span>Show Preview</span>
                                    <span className={"icon"}><NewspaperIcon/></span>
                                </>
                            }
                            {documentPreview &&
                                <>
                                    <span>Get Code</span>
                                    <span className={"icon"}><PrinterIcon/></span>
                                </>
                            }
                        </button>
                    </div>
                    <div className={"card-content"}>
                        <div className={"container is-overflow-scroll"}>
                            <DefaultErrorBoundary title={"Failed to render Document View."}>
                                <DocumentRenderer headerTemplate={"/templates/headers/security.tmpl"}
                                                  footerTemplate={"/templates/footers/stamp-here.tmpl"}
                                                  contentTemplate={"/templates/documents/arrest-report.tmpl"}
                                                  className={"mx-auto"}
                                                  type={documentPreview ? "viewer" : "editor"}
                                                  parameters={{
                                                      ...defaultDocParams, ...arrestDetails,
                                                      "violations": formattedText,
                                                      "sentence": isCapital ? "Capital Punishment" : `${totalSentence} minutes`,
                                                      "trial": requiresTrial ? "([bold]Trial Required[/bold])" : "",
                                                  }}/>
                            </DefaultErrorBoundary>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <DefaultErrorBoundary title={"Failed to render Violation Builder."}>
            <ViolationBuilder
                active={violationBuilderActive}
                editMode={isViolationBuilderEditor}
                onChange={(v) => {
                    setPendingViolation(v)
                }}
                onSubmit={() => {
                    if (pendingViolation) {
                        const updatedViolations = [...violations];
                        if (isViolationBuilderEditor) {
                            const targetIndex = updatedViolations.findIndex(v => v.uuid === pendingViolation.uuid);
                            if (targetIndex !== -1) {
                                updatedViolations[targetIndex] = pendingViolation;
                            } else {
                                console.log("Could not find violation to edit.");
                                console.log(pendingViolation);
                            }
                        } else {
                            updatedViolations.push(pendingViolation);
                        }

                        setViolations(updatedViolations);
                    }
                    closeViolationBuilder();
                }}
                onCancel={() => {
                    closeViolationBuilder();
                }}
                pendingViolation={pendingViolation}
            />
        </DefaultErrorBoundary>
    </>)
}