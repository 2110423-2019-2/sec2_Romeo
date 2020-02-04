import React from "react";
import { Link } from "react-router-dom"

class Nav extends React.Component {
    render() {
        return (
            <nav class="main">
                <Link to="/">
                    <h3>Photo Bro</h3>
                </Link>
                <button>Logout</button>
            </nav>
        )
    }
}

export default Nav;

