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
// api/biu/get/recommend/?type=illust&totalPage=5&groupIndex=0&sortMode=0&isSort=0
// 搜索
// /api/biu/search/works/?kt=幼女&mode=tag&totalPage=5&isCache=1&groupIndex=0&sortMode=0
$(".dropdown-item").click(function () {
  var search_text = $(".search-text").val();
  var mode = $("dropdown-item").val();
  // $(".search-text").val(null);
  $.ajax({
    url: "api/biu/search/works/",
    type: "GET",
    data: {
      kt: search_text,
      mode: mode,
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

// $.ajax({
//   url: "api/biu/get/rank/",
//   type: "GET",
//   data: {
//     mode: "day",
//     totalPage: 1,
//     groupIndex: 0,
//   },
//   success: function (rep) {
//     rep = jQuery.parseJSON(JSON.stringify(rep));
//     if (rep.code) {
//       console.log(rep.msg.rst.data);
//       tmpPageData = rep.msg;
//       showPics("排行榜@", ["main", "header"]);
//     } else {
//       showPics("Error :<", ["main"], []);
//     }
//   },
//   error: function (rep) {
//     showPics("Error :<", ["main"], []);
//   },
// });
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
        '"><div class="card">' +
        '<a href="' +
        imgUrl +
        '">' +
        '<img src="' +
        imgUrlCover +
        ' " class="card-img-top"' +
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
  }
}
