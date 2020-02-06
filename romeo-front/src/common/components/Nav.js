import React from "react";
import { Link } from "react-router-dom"
import { Button } from 'antd';

import { connect } from "react-redux";
import { logOut } from "common/actions/auth";
import history from "common/router/history";


class Nav extends React.Component {
    render() {
        const { logOut } = this.props;
        return (
            <nav class="main-nav" style={{ zIndex: 9999 }}>
                <div class="container d-flex align-center justify-space-between">
                    <Link to="/">
                        <h3 className="ma-0">Photo Bro</h3>
                    </Link>
                    <Button type="primary" onClick={() => logOut(history)}>Logout</Button>
                </div>
            </nav>
        )
    }
}

export default connect(
    null,
    { logOut }
)(Nav);

