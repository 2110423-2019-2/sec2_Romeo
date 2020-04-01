import React from "react";
import { Rate } from "antd";
import Axios from "axios";

class Reviews extends React.Component {
    state = {
        reviews: []
    }
    async componentDidMount() {
        const { username } = this.props.currentPhotographer.profile.user
        const res = await Axios.get("/api/review?search=" + username);
        if (res.data) {
            this.setState({ reviews: res.data })
        }
    }
    render() {
        const { reviews } = this.state;
        return (
            <div>
                <h1>Reviews</h1>
                { 
                    reviews.length > 0 ? (
                        <div className="photo-grid">{
                            reviews.map((e,i) => (
                                <div className="snippet secondary photo-grid-photo ma-2" key={`${e.reviewJob}index${i}`}>
                                    <div>
                                        <Rate disabled allowHalf defaultValue={e.rateJob/2} className="mb-2"/>
                                        { e.reviewDetail ? (
                                            <p className="mb-0">{e.reviewDetail}</p>
                                        ): <p className="mb-0 t-color-light" style={{ fontStyle: 'italic' }}>Rated {e.rateJob/2} out of 5</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span className="t-color-light d-block pb-3" style={{ fontStyle: 'italic' }}>
                            No reviews yet.
                        </span>
                    )
                }
            </div>
        )
    }
}

export default Reviews;