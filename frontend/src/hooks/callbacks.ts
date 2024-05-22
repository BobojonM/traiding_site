export const getAlmatyTime = (time: string) => {
    const inputDate = new Date(time);
    const sixHoursLater = new Date(inputDate.getTime());
    const year = sixHoursLater.getFullYear();
    const month = String(sixHoursLater.getMonth() + 1).padStart(2, '0');
    const day = String(sixHoursLater.getDate()).padStart(2, '0');
    const hours = String(sixHoursLater.getHours()).padStart(2, '0');
    const minutes = String(sixHoursLater.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
};