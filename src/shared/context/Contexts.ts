import {Context, createContext, Dispatch, SetStateAction} from "react";
import {TitleData} from "../../types/Site.ts";

export type TitleContextProps = {
    data: TitleData,
    setTitle: Dispatch<SetStateAction<TitleData>>
}

export const TitleContext: Context<TitleContextProps> =
    createContext<TitleContextProps>({
        data: {title: "", subtitle: undefined}, setTitle: () => {
        }
    });