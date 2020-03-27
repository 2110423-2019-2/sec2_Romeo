import history from "common/router/history";
import Axios from "axios";

export const statusLabels = {
    PENDING: "Pending",
    DECLINED: "Declined",
    MATCHED: "Matched",
    PAID: "Paid",
    CANCELLED: "Cancelled",
    PROCESSING: "Processing Photos",
    COMPLETED: "Completed",
    CLOSED: "Closed"
}

export const decline = (job, actorType) => {
    // Only for photographers
    if (actorType === 1) {
        Axios.patch(`/api/jobs/${job.job_id}/`, {
            job_status: "DECLINED"
        })
    }
}

export const cancel = (job, actorType) => {
    // Wait for backend to receive cancellation actor
    Axios.patch(`/api/jobs/${job.job_id}/`, {
        job_status: "CANCELLED"
    })
}

// Called by payment pages
export const paid = (job) => {
    Axios.patch(`/api/jobs/${job.job_id}/`, {
        job_status: "PAID"
    })
}
export const closeJob = (job) => {
    Axios.patch(`/api/jobs/${job.job_id}/`, {
        job_status: null
    })
}

export const proceed = (job, actorType, data) => {
    // Normal flow of events
    if (actorType === 1) {
        // Photographers
        if (job.job_status === "PENDING") {
            Axios.patch(`/api/jobs/${job.job_id}/`, {
                job_status: "MATCHED"
            })
        } else if (job.job_status === "PAID") {
            Axios.patch(`/api/jobs/${job.job_id}/`, {
                job_status: "PROCESSING"
            })
        } else if (job.job_status === "PROCESSING") {
            Axios.patch(`/api/jobs/${job.job_id}/`, {
                job_status: "COMPLETED",
                job_url: data.job_url
            })
        }
    } else {
        // Customers
        if (job.job_status === "MATCHED") {
            history.push("/payment/" + job.job_id);
        }
        if (job.job_status === "COMPLETED") {
            history.push("/payment/" + job.job_id);
        }
    }
}

export const makeDepositPayment = (jobId) => {

}