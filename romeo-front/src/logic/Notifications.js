import React from "react";
import Axios from "axios";
import { statusLabels } from "./Reservation";

export const getNotificationText = (username, status) => {
    switch (status) {
        case "PENDING": return <span>You have a new reservation request from <b>{username}</b></span>
        case "DECLINED": return <span>Your reservation for <b>{username}</b> has been declined.`}</span>
        case "MATCHED": return <span>Your reservation for <b>{username}</b> has been accepted. Please pay the deposit.</span>
        case "PAID": return <span>Customer <b>{username}</b> has paid the deposit.</span>
        case "CANCELLED": return <span>Your reservation of <b>{username}</b> has been cancelled.</span>
        case "PROCESSING": return <span>Photographer <b>{username}</b> has started processing your photos.</span>
        case "COMPLETED": return <span>Your photos from <b>{username}</b> are ready! Please pay for the rest of the price to view your photos.</span>
        case "CLOSED": return <span>Customer <b>{username}</b> has made their payment.</span>
        default: return <span>Customer <b>{username}</b> has made their payment.</span>
    }
}

export const receiveNotifications = async (username) => {
    try {
        const res = await Axios.get("/api/notification/?search=" + username);
        if (res.data) {
            return res.data.sort((a,b) => b.noti_id - a.noti_id)
        } else {
            return []
        }
    } catch (err) {
        console.log(err);
        return [];
    }
}