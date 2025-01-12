import {HTMLProps, PropsWithChildren} from "react";
import classNames from "classnames";

export type MessageContainerProps = {
    dark?: boolean,
    link?: boolean,
    primary?: boolean,
    info?: boolean,
    success?: boolean,
    warning?: boolean,
    danger?: boolean,
} & PropsWithChildren & HTMLProps<HTMLDivElement>;

export type MessageHeaderProps = PropsWithChildren & HTMLProps<HTMLDivElement>;
export type MessageBodyProps = PropsWithChildren & HTMLProps<HTMLDivElement>;

function MessageHeader(props: MessageHeaderProps) {
    const {children, className} = props;

    return (<div className={classNames("message-header", className)}>
        {children}
    </div>)
}

function MessageBody(props: MessageBodyProps) {
    const {children, className} = props;

    return (<div className={classNames("message-body", className)}>
        {children}
    </div>)
}

function MessageContainer(props: MessageContainerProps) {

    const {children, id, className} = props;

    const classes = classNames("message", {
        "is-dark": props.dark,
        "is-link": props.link,
        "is-primary": props.primary,
        "is-info": props.info,
        "is-success": props.success,
        "is-warning": props.warning,
        "is-danger": props.danger
    }, className)

    return (<div id={id} className={classes}>
        {children}
    </div>)
}

const Message = Object.assign(MessageContainer, {
    Header: MessageHeader, Body: MessageBody
});

export default Message;