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
                    <NavLink to = "/saved" style={({ isActive }) => ({
                        fontWeight: isActive ? "bold" : "normal",
                        color: isActive ? "blue" : "black",
                    })} >
                        Saved Locations
                    </NavLink>

                    <NavLink to ="/MapComponent" style={({ isActive }) => ({
                        fontWeight: isActive ? "bold" : "normal",
                        color: isActive ? "blue" : "black",
                    })}>
                        Map Component
                    </NavLink>

                    <NavLink to ="/search" style={({ isActive }) => ({
                        fontWeight: isActive ? "bold" : "normal",
                        color: isActive ? "blue" : "black",
                    })}>
                        Search
                    </NavLink>

                    <NavLink to ="/" style={({ isActive }) => ({
                        fontWeight: isActive ? "bold" : "normal",
                        color: isActive ? "blue" : "black",
                    })}>
                        Home
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};

export default Navbar;