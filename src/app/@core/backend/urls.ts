// TASA Apis
// where G  stands for GET api request
// where PO stands for POST api request
// where PU stands for PUT api request
// where PA stands for PATCH api request
// where D  stands for DELETE api request
export const urls: any = {
  // Authentication
  getUsers: '/v1/users', // G
  login: '/v1/login', // PO
  signup: '/v1/signup', // PO
  checkUsername: '/v1/checkUserName/{userName}', // PO
  checkEmail: '/v1/checkEmail/{email}', // PO
  uploadUserImage: '/v1/uploadImage/{email}', // PO
  updatePassword: '/v1/auth/update-password', // PO
  forgotPassword: '/v1/auth/forgot-password/{email}', //PO
  resetPassword: '/v1/auth/reset-password', // PO
  checkCurrentPassword: '/v1/checkPassword/{email}/{currentPassword}', // PO
  activateUser: '/v1/users/activate/{userId}', // PO
  deactivateUser: '/v1/users/deactivate/{userId}', // PO

  // location
  getCountry: '/v1/locations', // G
  getCities: '/v1/locations/{countryCode}/cities', // G

  // Contact us
  contactUs: '/v1/contact-us', // PO

  // course
  getAllCourse: '/v1/courses/all', // G
  getCourseDetails: '/v1/courses/{courseKey}', // G
  getCourse: '/v1/courses/page/{page}/{size}', // G
  getCourseCount: '/v1/courses/count', // G
  searchCourse: '/v1/courses/search/{page}/{size}', // PO
  updateCourse: '/v1/courses/bulk/{userId}', // PO

  // tiers
  getTiers: '/v1/tier', // G
  addTier: '/v1/tier', // PO
  deleteTier: '/v1/tier/{tierId}', // DE
  updateTier: '/v1/tier', // PU

  // post
  addPost: '/v1/posts', // PO
  getPost: '/v1/posts', // G
  updatePost: '/v1/posts', // PU
  deletePost: '/v1/posts/{postId}', // DE
  changePostStatus: '/v1/posts/{postId}/{status}', //PO

  // upload
  uploadMultiFile: '/v1/uploadMultipleDocuments/{email}', // PO
  uploadSingle: '/v1/uploadNewsImage/{email}', // PO

  // lovs
  getLovsByGroup: '/v1/lov/{group}', // G
  getLovs: '/v1/lov', // G
  addLov: '/v1/lov', // PO
  updateLov: '/v1/lov', // PU
  deleteLov: '/v1/lov/{lovId}', // DE
  getFiltersData: '/v1/courses/filters', // G

  // News
  getNews: '/v1/news', // G
  addNews: '/v1/news', // PO
  updateNews: '/v1/news', // PU
  deleteNews: '/v1/news/{newsId}',
};
