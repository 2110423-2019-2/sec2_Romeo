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
            return res.data
        } else {
            return []
        }
    } catch (err) {
        console.log(err);
        return [];
    }
}

export const getNotifications = async (username) => {
    if (!localStorage.getItem("notifications")) { 
        const notifications = await receiveNotifications(username);
        localStorage.setItem("notifications", JSON.stringify(notifications));
        return notifications;
    }
    readNotifications();
    const currentNotifications = [...JSON.parse(localStorage.getItem("notifications"))].slice(0,4);
    const notifications = (await receiveNotifications(username)).slice(0,4);
    const newNotifications = compareNotifications(currentNotifications, [...notifications]);
    localStorage.setItem("notifications", JSON.stringify([...currentNotifications, ...newNotifications]));
    return [...currentNotifications, ...newNotifications];
}

export const readNotifications = () => {
    let notifications = [...JSON.parse(localStorage.getItem("notifications"))];
    notifications.forEach(e => delete e.front_new);
    localStorage.setItem("notifications", JSON.stringify(notifications));
}

export const  compareNotifications = (current, myNew) => {
    let difference = [];
    myNew.forEach(e => {
        current.forEach(f => {
            if (e.noti_id !== f.noti_id) {
                difference.push(e);
            }
        })
    })
    difference.map((e,i) => {
        e.front_new = true
    });
    return difference;
}