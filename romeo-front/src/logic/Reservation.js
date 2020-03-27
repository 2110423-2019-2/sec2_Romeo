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
    Axios.patch(`/api/jobs/${job.job_id}/`, {
        job_status: actorType === 1 ? "CANCELLED_BY_PHOTOGRAPHER" : "CANCELLED_BY_CUSTOMER"
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
        } else if (job.job_status === "PROCESSING" || job.job_status === "COMPLETED") {
            Axios.patch(`/api/jobs/${job.job_id}/`, {
                job_status: "COMPLETED",
                job_url: data
            })
        }
    } else {
        // Customers
        if (job.job_status === "MATCHED") {
            Axios.patch(`/api/jobs/${job.job_id}/`, {
                job_status: "PAID"
            })
        }
        if (job.job_status === "COMPLETED") {
            Axios.patch(`/api/jobs/${job.job_id}/`, {
                job_status: "CLOSED"
            })
        }
    }
    window.location.reload();
}

export const makeDepositPayment = (jobId) => {

}