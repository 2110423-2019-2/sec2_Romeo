import Axios from "axios"
import moment from "moment";

export const receiveNotifications = async (username) => {
    try {
        const res = Axios.get("/api/notification/?search=" + username);
        if (res.data) {
            localStorage.setItem("notifications", JSON.stringify(res.data));
        } else {
            localStorage.setItem("notifications",JSON.stringify([]))
        }
    } catch (err) {
        console.log(err);
        localStorage.setItem("notifications",JSON.stringify([]))
    }
}

export const getNotifications = async (username) => {
    if (!localStorage.getItem("notifications")) { 
        const notifications = await receiveNotifications(username);
        return notifications;
    }
    const currentNotifications = [...JSON.parse(localStorage.getItem("notifications"))];
    await receiveNotifications();
    const notifications = [...JSON.parse(localStorage.getItem("notifications"))];
    const newNotifications = compareNotifications(currentNotifications, notifications);
    localStorage.setItem("notifications", JSON.stringify([...currentNotifications, ...newNotifications]));
    return [...currentNotifications, ...newNotifications];
}

export const readNotifications = () => {
    let notifications = [...JSON.parse(localStorage.getItem("notifications"))];
    notifications.forEach(e => delete e.front_new);
    localStorage.setItem("notifications", JSON.stringify(notifications));
}

export const compareNotifications = (current, myNew) => {
    let difference = myNew.filter(x => !current.includes(x));
    difference.forEach((e,i) => {
        e.front_new = true
    });
    return difference;
}