angular.module('starter.services', [])

	.factory('$localStorage', ['$window', function ($window) {
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
	}])

	.service('$restService', function ($http, $log) {
		var apiRoot = "https://public-api.wordpress.com/rest/v1.1/sites/theartofprotest.jinbo.net";

		/**
		 * 카테고리 목록과 각 카테고리에 속한 문서 목록을 함께 가져온다.
		 * @returns {Promise}
		 */
		this.getPostsByCategory = function () {
			return $http({
				method: 'GET',
				url: apiRoot + "/posts/",
				params: {
					'type': 'page',
					'category': 'manual',
					'status': 'publish',
					'fields': 'ID,title,modified,categories,menu_order'
				}
			});
		};

		/**
		 * @returns {Promise}
		 */
		this.getNotices = function () {
			return $http({
				method: 'GET',
				url: apiRoot + "/posts/",
				params: {
					'category': 'notice',
					'status': 'publish',
					'order': 'desc',
					'order_by': 'date'
				}
			});
		};

		/**
		 * @returns {Promise}
		 */
		this.getNotice = function (noticeId) {
			return $http({
				method: 'GET',
				url: apiRoot + "/posts/" + noticeId
			})
		};

		/**
		 * 서버로부터 목록을 내려받는다.
		 * @returns {Promise}
		 */
		this.getPosts = function () {
			return $http({
				method: 'GET',
				url: apiRoot + "/posts/",
				params: {
					'type': 'page',
					'category': 'manual',
					'status': 'publish'
				}
			})
		};

		/**
		 * 서버로부터 항목을 내려받는다.
		 * @param {Number} postId 내려받을 항목의 ID
		 * @returns {Promise}
		 */
		this.getPost = function (postId) {
			return $http({
				method: 'GET',
				url: apiRoot + "/posts/" + postId
			});
		};
	})

	.service('$db', function () {
		this.documents = new PouchDB('documents');
		this.bookmarks = new PouchDB('bookmarks');
	});
