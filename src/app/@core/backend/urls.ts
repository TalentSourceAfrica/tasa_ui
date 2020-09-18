// TASA Apis
// where G  stands for GET api request
// where PO stands for POST api request
// where PU stands for PUT api request
// where PA stands for PATCH api request
// where D  stands for DELETE api request
export const urls: any = {
  // home

  getNews: '/news', // G
  gePost: '/posts', // G

  // Authentication

  getUsers: '/users', // G
  login: '/v1/login', // PO
  signup: '/v1/signup', // PO
  checkUsername: '/v1/checkUserName/{userName}', // PO
  checkEmail: '/v1/checkEmail/{email}', // PO
  uploadUserImage: '/v1/uploadImage/{email}', // PO
  forgotPassword: '/v1/auth/forgot-password/{email}', //PO

  // Contact us
  contactUs: '/v1/contact-us', //Po
};
