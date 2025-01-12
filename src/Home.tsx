import {useContext, useEffect, useState} from "react";
import {NavLink} from "react-router";
import classNames from "classnames";
import {ErrorBoundary} from "react-error-boundary";
import ErrorView from "./shared/elements/ErrorView.tsx";
import Message from "./shared/elements/Message.tsx";

import {ChangeLog, TitleData} from "./types/Site.ts";
import {TitleContext} from "./shared/context/Contexts.ts";

const title: TitleData = {
    title: "FaintSpeaker's SS14 Tools", subtitle: undefined,
}

function RecentChanges({cols, max}: { cols: number, max: number }) {
    const [recentChanges, setRecentChanges] = useState<ChangeLog[]>();
    const [loading, setLoading] = useState<boolean>(true);

    const className = classNames("fixed-grid", `has-${cols}-cols-desktop`, "has-1-cols-mobile", "has-1-cols-tablet");

    useEffect(() => {
        fetch("/changes.json")
            .then(response => response.json())
            .then((data: ChangeLog[]) => {
                setRecentChanges(data.slice(0, max))
                setLoading(false);
            })
    }, [max])

    if(loading){
        return (
            <div className={className}>
                <div className={"grid"}>
                    {[...Array(max)].map((_, index) => (
                        <div key={index} className={"cell"}>
                            <div className={"card is-skeleton"}>
                                <div className={"card-header"}>
                                    <p className={"card-header-title is-skeleton"}>&nbsp;</p>
                                </div>
                                <div className={"card-content is-skeleton"}>
                                    <p className={"block"}>&nbsp;</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!recentChanges || recentChanges.length === 0) {
        return <Message info>
            <Message.Body>No recent changes.</Message.Body>
        </Message>
    }

    return (
        <div className={className}>
            <div className={"grid"}>
                {recentChanges && recentChanges.map((change, index) => (
                    <div className={"cell"}>
                    <div className={"card"} key={index}>
                            <div className={"card-header"}>
                                <p className={"card-header-title"}>{change.title}</p>
                            </div>
                            <div className={"card-content"}>
                                <p className={"block"}>{change.description}</p>
                            </div>
                            {change.url &&
                                <div className={"card-footer"}>
                                    <NavLink to={change.url} className={"card-footer-item"}>Go to Tool</NavLink>
                                </div>
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}


export default function Home() {
    const {setTitle} = useContext(TitleContext);

    useEffect(() => {
        setTitle(title)
    });

    return (<>
        <div className={"block"}>
            <h2 className={"title is-2"}>Introduction</h2>
            <p className={"block"}>This site is largely set up just to allow me to generate paperwork when I'm playing,
                purely because I find fictional paperwork to be hilarious and fun. Very little of this is actually
                automated. I just threw a bunch of typescript and react together. There's no server-side, no accounts,
                no database. Just a few static files, and some JSON files that get loaded when needed.</p>
            <Message warning>
                <Message.Header>
                   Note regarding data persistence
                </Message.Header>
                <Message.Body>
                    <p className={"block"}>If any of these tools have persistence, be aware that it is likely being
                        stored in your browser's localstorage, and clearing browser data will wipe it.</p>
                    <p className={"block"}>Anything not saved <strong>will</strong> be lost.</p>
                </Message.Body>
            </Message>
        </div>
        <div className={"block"}>
            <h1 className={"title is-2"}>Recent Changes</h1>
            <ErrorBoundary
                fallback={<ErrorView title={"Fetch Failure"} description={"Failed to fetch recent changes."}/>}>
                <RecentChanges cols={3} max={6}/>
            </ErrorBoundary>
        </div>
    </>)
}