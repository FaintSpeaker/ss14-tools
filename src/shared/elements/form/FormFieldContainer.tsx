import {HTMLProps, PropsWithChildren} from "react";
import classNames from "classnames";

export type FormFieldProps = {
    label: string,
} & PropsWithChildren & HTMLProps<HTMLDivElement>;

export default function FormFieldContainer({children, label, className, id}: FormFieldProps)
{
    return (
        <div id={id} className={classNames("field", className)}>
            <label className={"label"}>{label}</label>
            <div className={"field-body"}>
                {children}
            </div>
        </div>
    );
}