// TASA Apis
// where G  stands for GET api request
// where PO stands for POST api request
// where PU stands for PUT api request
// where PA stands for PATCH api request
// where D  stands for DELETE api request
export const urls: any = {
  // Authentication
  getUsers: '/users', // G
  getUserById: '/users/view/{tasaId}', // G
  viewProfile: '/users/viewprofile/{tasaId}', // G
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
  searchUser: '/users/search/{page}/{size}/{searchText}', // G
  searchFreelancer: '/users/freelancer/search/{page}/{size}/{searchText}', // G
  verifyEmail: '/verifyemail/{hash}', // G
  getTribe: '/tribe', // G

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
  favCourse: '/users/favorite/{userId}/{courseKey}', // G
  unfavCourse: '/users/unfavorite/{userId}/{courseKey}', // G

  // Subscription
  getSubscriptions: '/subs', // G
  getSubscriptionById: '/subs/{subsId}', // G

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
  deletePost: '/socialPost/{postId}', // DE
  changePostStatus: '/posts/{postId}/{status}', // PO

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
  getNewsById: '/news/{newsId}', // G
  addNews: '/news', // PO
  updateNews: '/news', // PU
  deleteNews: '/news/{newsId}', // DE

  // Partner
  getPartner: '/partner', //G
  deletePartner: '/partner/{partnerId}', //DE
  addPartner: '/partner', //PO
  updatePartner: '/partner', // PA

  // Jobs
  getAllJobs: '/job/page/{page}/{size}', // G
  getRecruiterPostedJobs: '/job/recruiter/{recruiterId}/{status}/{page}/{size}', // G
  getJob: '/job/{jobId}', // G
  updateJob: '/job/{jobId}', // PA
  deleteJob: '/job/{jobId}', // DE
  createJob: '/job', // PO
  applyJob: '/job/apply/{jobId}',
  searchJobs: '/job/search/{page}/{size}', // PO
  getJobsCount: '/job/count', // G
  getJobApplications: '/job/applicant/{userId}/{page}/{size}', // G
  withdrawFromJob: '/job/withdraw/{jobId}', // PO
  updateJobNew: '/job/{userId}', // PU
  saveJob: '/users/savedjob/{userId}/{jobId}', // G
  removeSavedJob: '/users/removesavedjob/{userId}/{jobId}', // G
  publishJob: '/job/publish/{jobId}/{status}', // PO
  listUnlist: '/job/unlist/{jobId}/{status}', // PO
  getJobsByOrg: '/job/organization/dashboard/{orgId}', // G

  // Dashboard
  getRecommendedCourses: '/recs/courses/{userId}', // G
  getRecommendedJobs: '/recs/jobs/{userId}', // G
  getRecommendedGroups: '/recs/groups/{userId}', // G

  // Social Network
  getAllPosts: '/socialPost', // G
  getPostById: '/socialPost/{postId}', // G
  getPostsByUser: '/user/socialPost/{userId}', // G
  getActivityPostByUser: '/user/activity/socialPost/{userId}', // G
  addSocialPost: '/socialPost', // PO
  deleteSocialPost: '/post/{postId}', // DE
  updateSocialPost: '/post', // PU
  addComment: '/socialPost/comment/{postId}', // PO
  removeComment: '/socialPost/removecomment/{postId}/{commentId}', // PO
  reactOnPost: '/socialPost/react/{postId}', // PO
  removeReactionFromPost: '/socialPost/removeReact/{postId}/{reactionId}', // PO
  sharePost: '/socialPost/share/{postId}', // PO

  // Organisation
  getOrganisation: '/organization', // G
  getSingleOrganization: '/organization/{orgId}', // G
  getActiveOrganization: '/organization/isactive', // G
  deleteOrganisation: '/organization/{orgId}', // DE
  addOrganization: '/organization/{type}', // PO
  updateOrganization: '/organization/bulk/{userId}', // PO
  updateSingleOrganization: '/organization', // PU
  searchOrganization: '/organisation/search/{page}/{size}/{searchText}', // G

  // Notification
  getAllNotifications: '/notifications/all/{userId}', // G
  getNewNotifications: '/notifications/new/{userId}', // G
  createNotification: '/notifications', // PO
  readNotification: '/notifications/read/{notificationId}', // PO
  deleteNotifications: '/notifications', // D

  // Connections
  getAllNetworkConnections: '/sn/connections/{userId}', // G
  getAllNetworkPendingConnections: '/connectionRequests/pending/{userId}', //G
  sendNetworkConnectionRequest: '/connectionRequests/{fromUserId}/{toUserId}', // PO
  approveNetworkConnection: '/connectionRequests/approve/{requestId}', // PO
  rejectNetworkConnection: '/connectionRequests/reject/{requestId}', // PO

  // Chat
  myConnections: '/chat/my/{userId}', // G
  startConnection: '/chat/start/{from}/{to}', // PO
  sendMessage: '/chat/messages/send', // PO
  getAllMessages: '/chat/messages/all/{chatId}', // G
  getAllNewMessages: '/chat/messages/new/{chatId}/{userId}', // G
  readMessages: '/chat/read/{chatId}', // PO
  getAllMessagesByGroup: '/chat/messages/group/all/{groupId}', // G
  getAllNewMessagesByGroup: '/chat/messages/group/new/{groupId}/{userId}', // G
  readMessagesGroup: '/chat/group/read/{groupId}/{userId}', // PO

  // Group
  createGroup: '/groups/{adminId}', // PO
  deleteGroup: '/groups/hard/{adminId}/{groupId}', // DE
  getGroupInfo: '/groups/{groupId}', // G
  getAllActiveFroup: '/groups/active', // G
  getAllActiveGroupByUser: '/groups/mygroups/{userId}', // G
  sendRequestToGroup: '/groupRequest/{userId}/{groupId}', // PO
  sendRequestToPeople: '/groupInvite/{adminId}/{userId}/{groupId}', // PO
  sendRequestToMultiplePeople: '/groupInvites/{adminId}/{groupId}', // PO
  searchGroup: '/groups/search/{searchText}', //PO

  // Subscription
  subscribeForTier: '/subs/subscribe/{tasaId}/{subscriptionId}', // PO
  buyCourse: '/subs/buy/{tasaId}/{courseId}', // PO
  enrollCourse: '/subs/enroll/{tasaId}/{courseId}', // PO
  getSubscription: '/subs/{id}', // G
  canByCourse: '/subs/canBuy/{tasaId}/{courseId}', // G
  canEnrollCourse: '/subs/canEnroll/{tasaId}/{courseId}', // G

  // seller & gig
  postSeller: '/gigcard', // PO
  getAllActiveGigs: '/gigcard/allActive', // G
  getUserActiveGigs: '/gigcard/allActive/{userId}', // G
  getUserInactiveGigs: '/gigcard/allInActive/{userId}', // G
  activateGig: '/gigcard/activate/{cardId}', // PO
  deactivateGig: '/gigcard/deactivate/{cardId}', // PO
};
