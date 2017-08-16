(function () {
    angular
        .module("CheckedIn")
        .controller("userController", userController);

    function userController($routeParams, $route, userService, venueService, reviewService, notificationService, $location, $rootScope, user) {
        var model = this;

        //Event handles:
        model.logout = logout;
        model.toNotification = toNotification;
        model.toFollow = toFollow;
        model.toBookmark = toBookmark;
        model.toReview = toReview;
        model.deleteReview = deleteReview;
        model.unfollowUser = unfollowUser;
        model.unbookmarkVenue = unbookmarkVenue;
        model.updateStatus = updateStatus;

        var userId = user._id;
        function init() {

            model.currentTab = "NOTIFICATION";

            userService.findUserByUserId(userId)
                .then(function (response) {
                    model.user = response;
                });
            $rootScope.title = "Your profile";
            userService.findFollowingForUser(userId)
                .then(function (response) {
                    model.following = response;
                });

            venueService.findVenuesForUser(userId)
                .then(function (response) {
                    model.bookmark = response;
                });

            reviewService.findReviewsForUser(userId)
                .then(function (response) {
                    model.review = response.reverse();
                });

            notificationService.findNotificationsForFollower(userId).then(function (response) {
                console.log(response);
                model.notification = response.reverse();
            });
        }
        init();

        function logout() {
            userService.logout()
                .then(function (response) {
                    $location.url("/login");
                });
        }

        function toNotification() {
            model.currentTab = "NOTIFICATION";
        }

        function toFollow() {
            model.currentTab = "FOLLOW";
        }

        function toBookmark() {
            model.currentTab = "BOOKMARK";
        }

        function toReview() {
            model.currentTab = "REVIEW";
        }

        function deleteReview(reviewId) {
            reviewService.deleteReview(reviewId)
                .then(function (response) {
                    $route.reload();
                });

        }

        function unfollowUser(followId) {
            userService.unfollowUser(userId, followId)
                .then(function (response) {
                    $route.reload();
                });

        }

        function unbookmarkVenue(venueId) {
            venueService.unbookmarkVenue(userId, venueId)
                .then(function (response) {
                    $route.reload();
                });

        }

        function updateStatus(user) {
            userService.updateUser(user._id, user);

            var notification = {type: "STATUS", _user: user._id, text: user.status};

            notificationService.createNotification(notification);
        }
    }
})();
