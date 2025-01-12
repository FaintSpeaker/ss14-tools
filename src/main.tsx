import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Route, Routes} from 'react-router';
import './index.scss'
import Home from './Home.tsx'

import {TitleProvider} from "./shared/context/TitleContext.tsx";
import MainLayout from "./shared/layout/MainLayout.tsx";
import ArrestReportBuilder from "./tools/arrest-report-builder/ArrestReportBuilder.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <TitleProvider titleData={{title: "FaintSpeaker's SS14 Tools", subtitle: "A collection of tools for SS14."}}>
            <BrowserRouter>
                <Routes>
                    <Route element={<MainLayout/>}>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/arrest-report-builder" element={<ArrestReportBuilder/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </TitleProvider>
    </StrictMode>,
)
