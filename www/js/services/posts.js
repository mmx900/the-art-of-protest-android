angular.module('starter.services')

	.service('PostDao',
	/**
	 * @ngdoc service
	 * @name PostDao
	 * @param {PouchDB} pouchDB
	 * @param {$log} $log
	 */
	function (pouchDB, $log) {
		var DB_NAME = "posts";
		var db = pouchDB(DB_NAME);

		this.list = function () {
			return db.allDocs({
				include_docs: true
			});
		};

		this.get = function (id) {
			return db.get(id);
		};

		this.put = function (post) {
			return db.upsert(post._id, function (doc) {
				if (doc.modified == post.modified)
					return false;

				return post;
			});
		};

		this.reset = function (notices) {
			return db.destroy()
				.then(function () {
					db = pouchDB(DB_NAME);
					return db.bulkDocs(notices);
				})
				.catch($log.error);
		};

		this.query = function (map, options) {
			return db.query(map, options);
		};
	})

	.factory('PostUpdater',
	/**
	 * @ngdoc factory
	 * @name PostUpdater
	 * @param {RestService} RestService
	 * @param {PostDao} PostDao
	 */
	function (RestService, PostDao) {

		/**
		 * 게시물의 정렬기준을 반환한다.
		 * @param post
		 * @returns {Number}
		 */
		var postOrder = function (post) {
			return post.menu_order;
		};

		return {
			/**
			 * 서버로부터 새로 목록을 내려받아 캐시한다.
			 * @returns {Promise}
			 */
			updateAll: function () {
				//TODO attachments 업데이트
				return RestService.getPosts()
					.then(function (response) {
						var posts = _.chain(response.data.posts)
							.map(function (obj) {
								//PouchDB ID 추가
								obj._id = obj.ID + "";
								return obj;
							})
							.sortBy(postOrder)
							.value();

						return PostDao.reset(posts);
					});
			},

			/**
			 * 서버로부터 새로 항목을 내려받아 캐시한다.
			 * @param {Number} postId 내려받을 항목의 ID
			 * @returns {Promise}
			 */
			update: function (postId) {
				return RestService.getPost(postId)
					.then(function (response) {
						var data = response.data;
						data._id = data.ID + "";
						PostDao.put(data);

						return data;
					});
			}
		};
	})

	.factory('PostService',
	/**
	 * @ngdoc factory
	 * @name PostService
	 * @param {PostDao} PostDao
	 */
	function (PostDao) {

		/**
		 * 게시물의 정렬기준을 반환한다.
		 * @param post
		 * @returns {Number}
		 */
		var postOrder = function (post) {
			return post.menu_order;
		};

		return {
			/**
			 * 캐시된 목록을 가져온다.
			 * @returns {Promise}
			 */
			list: function () {
				return PostDao.list()
					.then(function (result) {
						return _.chain(result.rows)
							.map(function (obj) {
								return obj.doc;
							})
							.sortBy(postOrder)
							.value();
					});
			},

			/**
			 * 캐시된 항목을 가져온다.
			 * @param {Number} postId 가져올 항목의 ID
			 * @returns {Promise}
			 */
			get: function (postId) {
				return PostDao.get(postId)
			},

			/**
			 * 문서 검색
			 *
			 * @param {string} keyword
			 * @param {number} limit
			 * @returns {Promise}
			 */
			query: function (keyword, limit) {
				return PostDao.query(function (doc) {
					// TODO workaround. global.keyword 참조
					var keyword = global["keyword"];
					if (doc.title.indexOf(keyword) > -1 || doc.content.indexOf(keyword) > -1)
						emit(doc);
				}, {include_docs: true, limit: limit});
			}
		};
	});

// TODO db.query의 eval() 문제 해결을 위한 workaround
var global = {};
global["keyword"] = "";