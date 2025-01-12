import {ArrestDetails, DetailedViolation} from "../../types/SpaceLaw";
import {BuildViolationTitle, crunchViolations, sortViolations} from "./SpaceLaw.ts";
import {ViolationSentenceView} from "./ViolationBuilder.tsx";
import {PencilIcon, TrashIcon} from "@heroicons/react/20/solid";
import FormFieldContainer from "../../shared/elements/form/FormFieldContainer.tsx";
import Message from "../../shared/elements/Message.tsx";

export type ArrestDetailsProps = {
    violations: DetailedViolation[], arrestDetails: ArrestDetails,

    onArrestDetailsChange: (arrestDetails: ArrestDetails) => void
    onViolationEdit: (violation: DetailedViolation) => void
    onViolationDelete: (violation: DetailedViolation) => void
};

type ViolationRowProps = {
    violation: DetailedViolation,

    onEdit?: (violation: DetailedViolation) => void
    onDelete?: (violation: DetailedViolation) => void
};

function ViolationRow({violation, onEdit, onDelete}: ViolationRowProps) {
    return (<>
        <tr>
            <td>
                <p className={"block"}>
                    {(violation.counts && violation.counts > 1) && <>{violation.counts}x </>}
                    <strong>{BuildViolationTitle(violation)}</strong>
                </p>
                <div className={"block"}>
                    <p><ViolationSentenceView violation={violation} tagged labeled/></p>
                    {violation.notes && <p><strong>Remarks:</strong> {violation.notes}</p>}
                </div>
            </td>
            <td style={{whiteSpace: "nowrap", breakInside: "avoid"}} className={"is-narrow"}>
                <div className={"field is-grouped"}>
                    {onEdit &&
                        <p className={"control"}>
                            <button className={"button is-small is-ghost"} onClick={() => onEdit?.(violation)}>
                                <span className={"icon is-small"}><PencilIcon/></span>
                                <span>Edit</span>
                            </button>
                        </p>
                    }
                    {onDelete &&
                        <p className={"control"}>
                            <button className={"button is-small is-ghost has-text-danger"}
                                    onClick={() => onDelete?.(violation)}>
                                <span className={"icon is-small"}><TrashIcon/></span>
                                <span>Delete</span>
                            </button>
                        </p>
                    }
                </div>
            </td>
        </tr>
    </>)
}

export function ArrestDetailsView(props: ArrestDetailsProps) {

    const {
        violations,
        onViolationEdit,
        onViolationDelete,
        arrestDetails,
        onArrestDetailsChange
    } = props;

    const {totalSentence, isCapital, requiresTrial} = crunchViolations(violations);

    return (<>
        <FormFieldContainer label={"Arrestee Name"}>
            <input type="text"
                   className={"input"}
                   value={arrestDetails.arrestee}
                   onChange={(e) => onArrestDetailsChange({
                       ...arrestDetails, arrestee: e.target.value
                   })}
            />
        </FormFieldContainer>
        <FormFieldContainer label={"Arresting Officer"}>
            <input type="text"
                   className={"input"}
                   value={arrestDetails.arrestingOfficer}
                   onChange={(e) => onArrestDetailsChange({
                       ...arrestDetails, arrestingOfficer: e.target.value
                   })}
            />
        </FormFieldContainer>
        <div className={"is-family-monospace table-container"}>
            <table className={"table is-striped is-hoverable is-fullwidth"}>
                <thead>
                <tr>
                    <th>Charge</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody className={""}>
                {violations.sort(sortViolations).map((violation) => (
                    <ViolationRow key={violation.uuid}
                                  violation={violation}
                                  onDelete={onViolationDelete}
                                  onEdit={onViolationEdit}/>
                ))}
                </tbody>
            </table>
            <p className={"block"}>
                <strong>Total sentence: </strong>
                {isCapital ? <>Capital Punishment</> : <>{totalSentence} minutes</>}
            </p>
            <div className={"block"}>
                {requiresTrial &&
                    <Message warning>
                        <Message.Header>Trial required</Message.Header>
                        <Message.Body>Capital crime or sentence exceeds maximum allowed.</Message.Body>
                    </Message>
                }
            </div>
        </div>
    </>)
}