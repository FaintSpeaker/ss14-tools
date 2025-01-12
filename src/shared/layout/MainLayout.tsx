import {NavLink, Outlet} from "react-router";
import {useContext, useState} from "react";
import classNames from "classnames";
import {LinkIcon} from "@heroicons/react/24/outline";
import {TitleContext} from "../context/Contexts.ts";

export default function MainLayout() {
    const titleData = useContext(TitleContext)
    const [burgerState, setBurgerState] = useState(false)

    const {title, subtitle} = titleData.data || {title: "", subtitle: undefined}

    return (
        <>
            <main className={"is-flex-grow-1"}>
                <nav className={"navbar is-fixed-top is-primary"} role={"navigation"} aria-label={"main navigation"}>
                    <div className="navbar-brand">
                        <NavLink className={"navbar-item"} to={"/"}>
                            <img src={"/faintspeaker-icon.png"} alt={"FaintSpeaker"}/>FaintSpeaker's SS14 Tools</NavLink>
                        <a role="button"
                           className={classNames("navbar-burger", {"is-active": burgerState})}
                           aria-label="menu"
                           aria-expanded="false"
                           onClick={() => setBurgerState(!burgerState)}>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </a>
                    </div>
                    <div className={classNames("navbar-menu", {"is-active": burgerState})}>
                        <div className={"navbar-start"}>
                            <NavLink className={"navbar-item"} to={"/arrest-report-builder"}>Arrest Report
                                Builder</NavLink>
                        </div>
                        <div className={"navbar-end"}>
                            <div className={"navbar-item"}>
                                <div className={"buttons"}>
                                    <a className={"button is-secondary is-outlined"} href={"https://delta-v.org/"}>
                                        <span>Delta-V</span>
                                        <span className={"icon is-small"}><LinkIcon/></span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                <section id={"site-header"} className={"hero is-primary"}>
                    <div className={"hero-body"}>
                        {title && <p className={"title"}>{title}</p>}
                        {subtitle && <p className={"subtitle"}>{subtitle}</p>}
                    </div>
                </section>
                <div className={"section"}>
                    <div className={"container"}>
                        <Outlet/>
                    </div>
                </div>
            </main>
            <div className={"footer is-fixed-bottom"}>

                <div className={"content has-text-centered"}>
                    <p>
                        <strong>SS14 Tools</strong> by <a href={"https://faintspeaker.com"}>FaintSpeaker</a>
                    </p>
                    <p>
                        I maintain these tools for free for as long as I stay interested in SS14.
                    </p>
                </div>
            </div>
        </>
    )
}