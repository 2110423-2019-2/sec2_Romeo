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
    CLOSED: "Closed",
    CANCELLED_BY_CUSTOMER: "Cancelled by Customer",
    CANCELLED_BY_PHOTOGRAPHER: "Cancelled by Photographer"
}

export const decline = (job, actorType) => {
    // Only for photographers
    if (actorType === 1) {
        Axios.patch(`/api/jobs/${job.job_id}/`, {
            job_status: "DECLINED"
        })
    }
    window.location.reload();
}

export const cancel = (job, actorType) => {
    Axios.patch(`/api/jobs/${job.job_id}/`, {
        job_status: actorType === 1 ? "CANCELLED_BY_PHOTOGRAPHER" : "CANCELLED_BY_CUSTOMER"
    })
    window.location.reload();
}

export const proceed = async (job, actorType, data) => {
    // Normal flow of events
    if (actorType === 1) {
        // Photographers
        if (job.job_status === "PENDING") {
            await Axios.patch(`/api/jobs/${job.job_id}/`, {
                job_status: "MATCHED"
            })
        } else if (job.job_status === "PAID") {
            await Axios.patch(`/api/jobs/${job.job_id}/`, {
                job_status: "PROCESSING"
            })
        } else if (job.job_status === "PROCESSING" || job.job_status === "COMPLETED") {
            await Axios.patch(`/api/jobs/${job.job_id}/`, {
                job_status: "COMPLETED",
                job_url: data
            })
        }
    } else {
        // Customers
        if (job.job_status === "MATCHED") {
            await Axios.patch(`/api/jobs/${job.job_id}/`, {
                job_status: "PAID"
            })
        }
        if (job.job_status === "COMPLETED") {
            await Axios.patch(`/api/jobs/${job.job_id}/`, {
                job_status: "CLOSED"
            })
        }
    }
    window.location.reload();
}

export const createCreditCardCharge = async (job, token) => {
    try {
        const res = await Axios({
            method: "POST",
            url: "/api/payment/",
            data: { 
                job_id: job.job_id, 
                omiseToken: token 
            },
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (res.data) window.location.reload();
    } catch (err) {
        console.log(err);
    }
}