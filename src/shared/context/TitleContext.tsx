import {PropsWithChildren, useState} from "react";
import {TitleData} from "../../types/Site";
import {TitleContext} from "./Contexts.ts";

export type TitleProviderProps = {
    titleData: TitleData
} & PropsWithChildren;

export function TitleProvider({children, titleData}: TitleProviderProps ) {
    const [data, setTitle] = useState(titleData);

    return (
        <TitleContext.Provider value={{data, setTitle}}>
            {children}
        </TitleContext.Provider>
    )
}