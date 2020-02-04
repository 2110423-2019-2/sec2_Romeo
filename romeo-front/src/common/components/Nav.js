import React from "react";
import { Link } from "react-router-dom"
import { Button } from 'antd';

class Nav extends React.Component {
    render() {
        return (
            <nav class="main-nav" style={{ zIndex: 9999 }}>
                <div class="container d-flex align-center justify-space-between">
                    <Link to="/">
                        <h3 className="ma-0">Photo Bro</h3>
                    </Link>
                    <Button type="primary">Logout</Button>
                </div>
            </nav>
        )
    }
}

export default Nav;

