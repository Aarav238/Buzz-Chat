// export const host = "http://localhost:5000";
//export const host = "https://chat-app-aarav.herokuapp.com";
export const host = "https://buzz-server-jg7t.onrender.com";

export const registerRoute = `${host}/api/auth/register`;
export const loginRoute = `${host}/api/auth/login`;
export const setAvatarRoute = `${host}/api/auth/setAvatar`;
export const allUsersRoutes = `${host}/api/auth/allusers`;
export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const getAllMessagesRoute = `${host}/api/messages/getmsg`;
export const subscribePushRoute = `${host}/api/auth/subscribe`;
export const VAPID_PUBLIC_KEY = "BHzLgLhdWnqeSNssT-YGUrYhRtMsijIxSoZgfLNMcZYEQF0X8QmtPQ7JCaqccDvj-jgUWfbH7Mx6RIyMKbZ9MK4";
