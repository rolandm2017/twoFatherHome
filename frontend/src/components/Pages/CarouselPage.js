import React from 'react';

import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';

import * as ROUTES from "../../constants/routes"

class Carousel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authUser: null,
            users: []
        }
    }

    render() {
        return (
            <div>
                <h1>Browse Users</h1>
            </div>
        )
    }
}

export default withRouter(withFirebase(Carousel));