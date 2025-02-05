import React from "react";
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink,
} from "./NavbarElements";

const Navbar = () => {
    return (
        <>
            <Nav>
                <Bars />

                <NavMenu>
                    <NavLink to = "/saved" activeStyle>
                        Saved Locations
                    </NavLink>

                    <NavLink to ="/MapComponent" activeStyle>
                        Map Component
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};

export default Navbar;