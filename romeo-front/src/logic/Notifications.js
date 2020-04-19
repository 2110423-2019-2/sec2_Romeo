import React from "react";
import Axios from "axios";

export const getNotificationText = (user, status) => {
    switch (status) {
        case "PENDING": return <span>You have a new reservation request from <b>{user}</b></span>
        case "DECLINED": return <span>Your reservation for <b>{user}</b> has been declined.</span>
        case "MATCHED": return <span>Your reservation for <b>{user}</b> has been accepted. Please pay the deposit.</span>
        case "PAID": return <span>Customer <b>{user}</b> has paid the deposit.</span>
        case "CANCELLED": return <span>Your reservation of <b>{user}</b> has been cancelled.</span>
        case "PROCESSING": return <span>Photographer <b>{user}</b> has started processing your photos.</span>
        case "COMPLETED": return <span>Your photos from <b>{user}</b> are ready! Please pay for the rest of the price to view your photos.</span>
        case "CLOSED": return <span>Customer <b>{user}</b> has made their payment.</span>
        case "REVIEWED": return <span>Customer <b>{user}</b> wrote you a review.</span>
        default: return <span>Customer <b>{user}</b> has made their payment.</span>
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

export const countUnread = (notifications) => {
    let out = 0;
    notifications.forEach(n => {
        if (n.noti_read !== "READ") {
            out += 1
        }
    });
    return out;
}

export const readNotifications = async (notifications) => {
    try {
        const res = await Axios.patch("/api/notification/"+notifications[0].noti_id+"/",{
            noti_read: "READ"
        });
        if (res.data) {
            notifications.forEach(e => e.noti_read = "READ");
            return notifications
        }
    } catch (err) {
        console.log(err);
        return notifications
    }
}