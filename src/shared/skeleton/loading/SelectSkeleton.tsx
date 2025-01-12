import classNames from "classnames";

export type SelectSkeletonProps = {
    type?: "skeleton" | "loading",
    loadingMessage?: string
}

export default function SelectSkeleton({type = "skeleton", loadingMessage = "Loading..."}: SelectSkeletonProps) {
    return (
        <div className={classNames("select","is-fullwidth",{"is-skeleton": type === "skeleton"}, {"is-loading": type === "loading"})}>
            <select disabled>
                <option>{loadingMessage}</option>
            </select>
        </div>
    )
}