import {XCircleIcon} from '@heroicons/react/20/solid';
import {ErrorBoundary} from "react-error-boundary";
import {PropsWithChildren, ReactNode} from "react";

export type ErrorProps = {
    title?: string,
    description?: string,
    err?: Error
}

// noinspection JSUnusedGlobalSymbols
export function ForceError() : ReactNode {
    throw new Error();
}

export function DefaultErrorBoundary({children, title} : {title?: string} & PropsWithChildren){
    return (
        <ErrorBoundary fallbackRender={({error}) => (<ErrorView err={error} title={title} description={error.message} />) }>
            {children}
        </ErrorBoundary>
    );
}

export default function ErrorView({title, description}: ErrorProps) {
    return (
        <div className="notification is-danger">
            <div className={"icon-text"}>
                <span className={"icon"}><XCircleIcon aria-hidden="true"/></span>
                <span className={"has-text-weight-bold"}>{title ?? "Error"}</span>
            </div>
            <div className={"block"}>
                {description || "An unknown error has occurred."}
            </div>
        </div>
    );
}