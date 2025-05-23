
const allowedUsers = [
    "user_2urIcn9WIMH90Sbpo6RFv2241oV",
];

export const isAdmin = (userId: string | null | undefined) => {
    if (!userId) {
        return false;
    }

    return allowedUsers.indexOf(userId) !== -1;
}