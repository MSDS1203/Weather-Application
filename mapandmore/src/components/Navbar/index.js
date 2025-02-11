import React from "react";
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
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

                    <NavLink to ="/search" activeStyle>
                        Search
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};

export default Navbar;