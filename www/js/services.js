angular.module('starter.services', ['starter.constants'])

	.factory('LocalStorage',
		/**
		 * @ngdoc factory
		 * @name LocalStorage
		 * @param {$window} $window
		 */
		function ($window) {
			return {
				set: function (key, value) {
					$window.localStorage[key] = value;
				},
				get: function (key, defaultValue) {
					return $window.localStorage[key] || defaultValue;
				},
				setObject: function (key, value) {
					$window.localStorage[key] = JSON.stringify(value);
				},
				getObject: function (key) {
					return JSON.parse($window.localStorage[key] || '{}');
				}
			}
		})

	.factory('RestService',
		/**
		 * @ngdoc factory
		 * @name RestService
		 * @param {$http} $http
		 * @param {$q} $q
		 * @param {$log} $log
		 * @param {ApiEndpoint} ApiEndpoint
		 */
		function ($http, $q, $log, ApiEndpoint) {
			return {
				/**
				 * 첫 화면의 컨텐츠를 가져온다.
				 * @returns {Promise}
				 */
				getHome: function () {
					return $http({
						method: 'GET',
						url: ApiEndpoint.home
					});
				},

				getVersion: function () {
					return $http.get(ApiEndpoint.version);
				},

				/**
				 * 카테고리 목록과 각 카테고리에 속한 문서 목록을 함께 가져온다.
				 * @returns {Promise}
				 */
				getPostsByCategory: function () {
					return $http({
						method: 'GET',
						url: ApiEndpoint.api + "/posts/",
						params: {
							'type': 'page',
							'category': 'manual',
							'status': 'publish',
							'fields': 'ID,title,modified,categories,menu_order',
							'number': 100
						}
					});
				},

				/**
				 * @returns {Promise}
				 */
				getNotices: function () {
					return $http({
						method: 'GET',
						url: ApiEndpoint.api + "/posts/",
						params: {
							'category': 'notice',
							'status': 'publish',
							'order': 'desc',
							'order_by': 'date'
						}
					});
				},

				/**
				 * @returns {Promise}
				 */
				getNotice: function (noticeId) {
					return $http({
						method: 'GET',
						url: ApiEndpoint.api + "/posts/" + noticeId
					})
				},

				/**
				 * 서버로부터 목록을 내려받는다.
				 * @returns {Promise}
				 */
				getPosts: function () {
					return $http({
						method: 'GET',
						url: ApiEndpoint.api + "/posts/",
						params: {
							'type': 'page',
							'category': 'manual',
							'status': 'publish',
							'fields': 'ID,URL,attachment_count,attachments,content,date,excerpt,featured_image,menu_order,modified,tags,title,categories',
							'number': 100
						}
					})
				},

				/**
				 * 서버로부터 항목을 내려받는다.
				 * @param {Number} postId 내려받을 항목의 ID
				 * @returns {Promise}
				 */
				getPost: function (postId) {
					return $http({
						method: 'GET',
						url: ApiEndpoint.api + "/posts/" + postId
					});
				}
			}
		});
