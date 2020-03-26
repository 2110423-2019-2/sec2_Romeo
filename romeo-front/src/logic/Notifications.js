import Axios from "axios"

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

export const receiveNotifications = async (username) => {
    try {
        const res = Axios.get("/api/notification/?search=" + username);
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
    const currentNotifications = [...JSON.parse(localStorage.getItem("notifications"))];
    const notifications = await receiveNotifications(username);;
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
    myNew.forEach((e,i) => {
        if (!current.includes(e)) difference.push(e);
    })
    difference.map((e,i) => {
        e.front_new = true
    });
    return difference;
}