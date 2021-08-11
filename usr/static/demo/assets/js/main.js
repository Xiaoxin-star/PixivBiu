var tmpCode;
var tmpPageData;
var tmpSearchSettings = {};
var downloadList = {};
var settingsMods = {
  "#settingsPageNum": ["pixivbiu_searchPageNum", 5, "每组页数"],
  "#settingsIsOriPic": ["pixivbiu_displayIsOriPic", "off", "大图预览"],
  "#settingsIsAllSort": ["pixivbiu_funIsAllSort", "off", "更多排序"],
  "#settingsSortMode": ["pixivbiu_sortMode", "0", "排序模式"],
  "#settingsSearchMode": ["pixivbiu_searchMode", "tag", "搜索模式"],
  "#settingsRvrProxyUrl": [
    "pixivbiu_RvrProxyUrl",
    "https://i.pixiv.cat",
    "图片反代地址",
  ],
};

// 推荐插画
// content_type: [illust, manga]
$.ajax({
  url: "api/biu/get/recommend/",
  type: "GET",
  data: {
    type: "illust",
    totalPage: 5,
    groupIndex: 0,
    sortMode: 0,
    isSort: 0,
  },
  success: function (rep) {
    rep = $.parseJSON(JSON.stringify(rep));
    if (rep.code) {
      tmpPageData = rep.msg;
      showPics("排行榜@", ["main", "header"]);
    } else {
      showPics("Error :<", ["main"], []);
    }
  },
  error: function (rep) {
    showPics("Error :<", ["main"], []);
  },
});
// 排行榜
// # mode(r18榜单需登录): [day_r18, day_male_r18, day_female_r18, week_r18, week_r18g]
function ranking_all(ranking_mode = "monthly", page = 1, date = null) {
  $.ajax({
    url: "api/biu/get/rank/",
    type: "GET",
    data: {
      mode: ranking_mode,
      totalPage: page,
      groupIndex: 0,
      sortMode: 0,
      isSort: 0,
    },
    success: function (rep) {
      rep = $.parseJSON(JSON.stringify(rep));
      if (rep.code) {
        tmpPageData = rep.msg;
        showPics("排行榜@", ["main", "header"]);
      } else {
        showPics("Error :<", ["main"], []);
      }
    },
    error: function (rep) {
      showPics("Error :<", ["main"], []);
    },
  });
}

// 搜索
// /api/biu/search/works/?kt=幼女&mode=tag&totalPage=5&isCache=1&groupIndex=0&sortMode=0
// 用户搜索
// 名称
///api/biu/search/users/?kt={user_name}&totalPage=5&groupIndex=0
// 指定作品ID
///api/biu/get/onework/?workID=%7Bwork_id%7D
// user-id
// 用户插画
///api/biu/get/idworks/?userID=%7Buser_id%7D&type=illust&sortMode=0&isSort=0&totalPage=5&groupIndex=0
// 漫画
///api/biu/get/idworks/?userID=%7Buser_id%7D&type=manga&sortMode=0&isSort=0&totalPage=5&groupIndex=0
// 收藏
///api/biu/get/idmarks/?userID=%7Buser_id%7D&restrict=public&sortMode=0&isSort=0&groupIndex=0&tmp=0%400
// 关注列表

///api/biu/get/idfollowing/?userID=%7Buser_id%7D&restrict=public&totalPage=5&groupIndex=0

$("#Search").click(function () {
  var search_text = $(".search-text").val();
  // $(".search-text").val(null);
  var mode = $(".mode").val();
  console.log(mode);
  $.ajax({
    url: "api/biu/search/works/",
    type: "GET",
    data: {
      kt: search_text,
      mode: "tag",
      totalPage: 1,
      isCache: 0,
      groupIndex: 0,
      sortMode: 0,
    },
    success: function (rep) {
      console.log(rep);
      rep = $.parseJSON(JSON.stringify(rep));
      if (rep.code) {
        tmpPageData = rep.msg;
        showPics("排行榜@", ["main", "header"]);
      } else {
        showPics("Error :<", ["main"], []);
      }
    },
    error: function (rep) {
      showPics("Error :<", ["main"], []);
    },
  });
});

function showPics(
  title = "",
  reLoadList = ["main", "header"],
  c = tmpPageData
) {
  let rstHtml = "",
    kt;

  if (c.rst && c.rst.data) {
    let i = 0;
    const data = c.rst.data;

    // 通用作品整理
    for (
      i = 0;
      i < data.length &&
      c["args"]["ops"]["method"] !== "userFollowing" &&
      c["args"]["ops"]["method"] !== "searchUsers";
      i++
    ) {
      var extra = "";
      var imgUrlCover = data[i]["image_urls"]["medium"].replace(
        "https://i.pximg.net",
        settingsMods["#settingsRvrProxyUrl"][1]
      );

      var imgUrl = data[i]["image_urls"]["large"].replace(
        "https://i.pximg.net",
        tmpSearchSettings["pixivbiu_RvrProxyUrl"]
      );

      // 图片预览内容
      var extraText =
        '<a target="_blank" href=".?code=%40u%3d' +
        data[i]["author"]["id"] +
        '%20-i">🔍作者插画</a> <a target="_blank" href=".?code=%40u%3d' +
        data[i]["author"]["id"] +
        '%20-c">🔍作者漫画</a>';

      if (data[i]["all"]["meta_pages"].length > 0) {
        extraText =
          '<a target="_blank" href=".?code=%40w%3d' +
          data[i]["id"] +
          '">👀查看</a> ' +
          extraText;
      }

      // 图片信息展示
      var desText =
        '<h2><a target="_blank" href="https://www.pixiv.net/artworks/' +
        data[i]["id"] +
        '">' +
        data[i]["title"] +
        '</a></h2><p>Created by <a target="_blank" href="https://www.pixiv.net/users/' +
        data[i]["author"]["id"] +
        '">' +
        data[i]["author"]["name"] +
        "</a> on " +
        data[i]["created_time"] +
        "<br>#收藏" +
        data[i]["total_bookmarked"] +
        " #浏览" +
        data[i]["total_viewed"] +
        "</p>";
      //// 标签
      var tagss = '<p style="max-width: 25%;">';
      for (let kk = 0; kk < data[i]["tags"].length; kk++) {
        tagss =
          tagss +
          '<a target="_blank" href=".?code=%40s%3d' +
          escape(data[i]["tags"][kk]) +
          ' -o">#' +
          data[i]["tags"][kk] +
          "</a> ";
      }
      desText = tagss + "</p>" + desText;
      if (c["args"]["ops"]["method"] === "oneWork" && i !== 0) {
        extra = "";
        extraText = "";
        desText = "";
      }

      // 最终结果
      rstHtml +=
        '<div class="card-group" id = "' +
        data[i]["id"] +
        '"><div class="card position-relative">' +
        '<div id="role" class="img position-absolute top-50 start-50 translate-middle"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>' +
        '<a href="' +
        imgUrl +
        '">' +
        '<img src="' +
        imgUrlCover +
        ' " class="card-img-top img-items"' +
        'alt="' +
        data[i]["title"] +
        '"/></a>' +
        '<div class="card-body">' +
        '<h5 class="card-title">' +
        data[i]["title"] +
        '</h5><h6 class="card-subtitle mb-2 text-muted">' +
        extra +
        '</h6><p class="card-text">' +
        extraText +
        "</p></div></div></div>";
    }

    // 输出
    $("#Card-img").html(rstHtml);
    $(".img").hide();
  }
}
