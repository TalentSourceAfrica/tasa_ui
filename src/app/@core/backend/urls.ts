// TASA Apis
// where G  stands for GET api request
// where PO stands for POST api request
// where PU stands for PUT api request
// where PA stands for PATCH api request
// where D  stands for DELETE api request
export const urls: any = {
  // Authentication
  getUsers: '/users', // G
  login: '/login', // PO
  signup: '/signup', // PO
  checkUsername: '/checkUserName/{userName}', // PO
  checkEmail: '/checkEmail/{email}', // PO
  uploadUserImage: '/uploadImage/{email}', // PO
  updatePassword: '/auth/update-password', // PO
  forgotPassword: '/auth/forgot-password/{email}', //PO
  resetPassword: '/auth/reset-password', // PO
  checkCurrentPassword: '/checkPassword/{email}/{currentPassword}', // PO
  activateUser: '/users/activate/{userId}', // PO
  deactivateUser: '/users/deactivate/{userId}', // PO

  // location
  getCountry: '/locations', // G
  getCities: '/locations/{countryCode}/cities', // G

  // Contact us
  contactUs: '/contact-us', // PO

  // course
  getAllCourse: '/courses/all', // G
  getCourseDetails: '/courses/{courseKey}', // G
  getCourse: '/courses/page/{page}/{size}', // G
  getCourseCount: '/courses/count', // G
  searchCourse: '/courses/search/{page}/{size}', // PO
  updateCourse: '/courses/bulk/{userId}', // PO

  // tiers
  getTiers: '/tier', // G
  addTier: '/tier', // PO
  deleteTier: '/tier/{tierId}', // DE
  updateTier: '/tier', // PU

  // post
  addPost: '/posts', // PO
  getPost: '/posts', // G
  getPostByUser: '/posts/user', // G
  getAdminPosts: '/admin/posts', // G
  updatePost: '/posts', // PU
  deletePost: '/posts/{postId}', // DE
  changePostStatus: '/posts/{postId}/{status}', //PO

  // upload
  uploadMultiFile: '/uploadMultipleDocuments/{email}', // PO
  uploadSingle: '/commonImageUpload/{email}', // PO

  // lovs
  getLovsByGroup: '/lov/{group}', // G
  getLovs: '/lov', // G
  addLov: '/lov', // PO
  updateLov: '/lov', // PU
  deleteLov: '/lov/{lovId}', // DE
  getFiltersData: '/courses/filters', // G

  // News
  getNews: '/news', // G
  addNews: '/news', // PO
  updateNews: '/news', // PU
  deleteNews: '/news/{newsId}', // DE

  // Jobs
  getAllJobs: '/jobs/page/{page}/{size}', // G
  getRecruiterPostedJobs: '/jobs/recruiter/{recruiterId}/{status}/{page}/{size}', // G
  getJob: '/job/{jobId}', // G
  updateJob: '/job/{jobId}', // PA
  deleteJob: '/job/{jobId}', // DE
  createJob: '/job', // PO
};
