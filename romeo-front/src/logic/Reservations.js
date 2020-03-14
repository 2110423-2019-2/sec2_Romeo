import moment from "moment";

export const getAllReservations = () => {
    // TODO: Connect to Backend
    if (!localStorage.getItem("reservations")) {
        localStorage.setItem("reservations", "[]");
        addReservation(mockReservation);
    }
    return JSON.parse(localStorage.getItem("reservations"));
}

export const addReservation = (reservation) => {
    // TODO: Connect to Backend
    const currentReservations = getAllReservations();
    localStorage.setItem("reservations", JSON.stringify([...currentReservations, reservation]));
}

export const getStatusText = (status) => {
    switch (status) {
        case "PENDING": return "Pending";
        default: return "Unknown";
    }
}

export const mockReservation = {
    key: "123",
    jobId: "123",
    jobDesc: "Photo for my girlfriend.",
    jobStatus: getStatusText("PENDING"),
    startDate: moment(new Date()),
    totalPrice: 5000,
    endDate: moment(new Date()).add(5, 'hours'),
}