const passwordRegex = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#?!@$%^&*-]).{8,30}$/
);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export { passwordRegex, emailRegex };
