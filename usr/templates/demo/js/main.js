var script = document.createElement("script");
script.type = "text/javascript";
script.src = "https://www.jq22.com/jquery/jquery-3.3.1.js";
document.getElementsByTagName("head")[0].appendChild(script);
setTimeout(function () {
  $(document).ready(function () {
    $("#bt").click(function () {
      alert("Hello World");
    });
  });
}, 100);
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

var text = $.ajax({
  url: "api/biu/get/rank/",
  type: "GET",
  data: {
    mode: "day",
    totalPage: 1,
    groupIndex: 0,
  },
  success: function (rep) {
    rep = jQuery.parseJSON(JSON.stringify(rep));

    if (rep.code) {
      console.log(rep.msg.rst.data);
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
function showPics(
  title = "",
  reLoadList = ["main", "header"],
  c = tmpPageData
) {
  let rstHtml = "",
    kt;
  let headerHtml =
    '<li><a href="javascript: isShowSettings();">搜索设置</a></li>';
  const typeName = {
    illustration: "图",
    manga: "漫",
    ugoira: "动",
    other: "其他",
  };
  if (c.rst && c.rst.data) {
    let i = 0;
    const data = c.rst.data;
    const groupIndex = Number(c["args"]["ops"]["groupIndex"]);
    // 整理结果
    // 用户作品类的用户信息显示
    if (c.rst.data.length > 0 && c["args"]["ops"]["method"] === "userWorks") {
      let li = "";
      if (data[0]["author"]["is_followed"]) {
        li =
          '<a id="follow_' +
          data[0]["author"]["id"] +
          '" href="javascript: doFollow(' +
          data[0]["author"]["id"] +
          ', \'del\');"><b class="tooltip" title="取消关注"><hicon>💘</hicon></b></a>';
      } else {
        li =
          '<a id="follow_' +
          data[0]["author"]["id"] +
          '" href="javascript: doFollow(' +
          data[0]["author"]["id"] +
          ', \'add\');"><b class="tooltip" title="关注"><hicon>💗</hicon></b></a>';
      }
      li +=
        '<a target="_blank" href="https://www.pixiv.net/users/' +
        data[0]["author"]["id"] +
        '"><d class="tooltip" title="打开画师 Pixiv 主页">Pixiv</d></a>';
      li +=
        '<a target="_blank" href=".?code=%40u%3d' +
        data[0]["author"]["id"] +
        '%20-f"><op class="tooltip" title="获取 TA 的关注列表">关注列表</op></a>';
      rstHtml +=
        '<article class="thumb"><a class="imageBtn"><img src="' +
        data[0]["all"]["user"]["profile_image_urls"]["medium"].replace(
          "i.pximg.net",
          "i.pixiv.cat"
        ) +
        '" alt="" /></a><h2>画师@' +
        data[0]["author"]["name"] +
        '</h2><section class="thumbAction">' +
        li +
        "</section></article>";
    }

    // 用户列表整理
    for (
      i = 0;
      i < data.length &&
      (c["args"]["ops"]["method"] === "userFollowing" ||
        c["args"]["ops"]["method"] === "searchUsers");
      i++
    ) {
      let li = "";
      if (data[i]["is_followed"]) {
        li =
          '<a id="follow_' +
          data[i]["id"] +
          '" href="javascript: doFollow(' +
          data[i]["id"] +
          ', \'del\');"><b class="tooltip" title="取消关注"><hicon>💘</hicon></b></a>';
      } else {
        li =
          '<a id="follow_' +
          data[i]["id"] +
          '" href="javascript: doFollow(' +
          data[i]["id"] +
          ', \'add\');"><b class="tooltip" title="关注"><hicon>💗</hicon></b></a>';
      }
      li +=
        '<a target="_blank" href=".?code=%40u%3d' +
        data[i]["id"] +
        '%20-i"><d class="tooltip" title="获取 TA 的作品">🔍作品</d></a>';
      rstHtml +=
        '<article class="thumb"><a class="imageBtn"><img src="' +
        data[i]["profile_image_urls"]["medium"].replace(
          "i.pximg.net",
          "i.pixiv.cat"
        ) +
        '" alt="" /></a><h2>' +
        data[i]["name"] +
        '</h2><section class="thumbAction">' +
        li +
        "</section></article>";
    }

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
        "https://i.pixiv.cat"
      );
      console.log(imgUrlCover);
      var imgUrl = data[i]["image_urls"]["large"].replace(
        "https://i.pximg.net",
        tmpSearchSettings["pixivbiu_RvrProxyUrl"]
      );
      var bookedNum = data[i]["total_bookmarked"];

      if (data[i]["all"]["meta_pages"].length > 0) {
        typeName["illustration"] = "多图";
        typeName["manga"] = "漫画";
        extra +=
          '<a target="_blank" href=".?code=%40w%3d' +
          data[i]["id"] +
          '"><op class="tooltip" title="查看完整作品">👀</op></a>';
      } else {
        typeName["illustration"] = "图";
        typeName["manga"] = "单漫";
      }

      if (tmpSearchSettings["pixivbiu_displayIsOriPic"] !== "on")
        imgUrl = imgUrlCover;
      console.log(imgUrlCover);
      if (c["args"]["ops"]["method"] === "rank") bookedNum = "";

      // 收藏按钮
      if (data[i]["is_bookmarked"]) {
        extra +=
          '<a id="marks_' +
          data[i]["id"] +
          '" href="javascript: doBookmark(' +
          data[i]["id"] +
          ', \'del\');"><b class="tooltip" title="取消收藏"><hicon>💘</hicon>' +
          bookedNum +
          "</b></a>";
      } else {
        extra +=
          '<a id="marks_' +
          data[i]["id"] +
          '" href="javascript: doBookmark(' +
          data[i]["id"] +
          ', \'add\');"><b class="tooltip" title="收藏"><hicon>💗</hicon>' +
          bookedNum +
          "</b></a>";
      }

      // 下载归类用的文件夹名称
      if (c["args"]["fun"]["kt"]) {
        kt = c["args"]["fun"]["kt"];
      } else if (c["args"]["ops"]["method"] === "userWorks") {
        kt =
          "画师_" + data[0]["author"]["name"] + "@" + data[0]["author"]["id"];
      } else if (c["args"]["ops"]["method"] === "userMarks") {
        kt = "收藏_" + c["args"]["fun"]["userID"];
      } else if (c["args"]["ops"]["method"] === "rank") {
        kt = "排行榜_" + c["args"]["fun"]["mode"];
      } else if (c["args"]["ops"]["method"] === "oneWork") {
        kt = "作品";
      } else {
        kt = c["args"]["ops"]["method"];
      }
      kt = kt.replaceAll("'", "\\'").replaceAll('"', '\\"');
      // 下载按钮
      extra +=
        '<a id="dl_' +
        data[i]["id"] +
        '" href="javascript: doDownloadPic(\'' +
        kt +
        "', " +
        data[i]["id"] +
        ", " +
        String(i) +
        ');"><d class="tooltip" title="下载">' +
        typeName[data[i]["type"]] +
        "</d></a>";

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
        // '<div class="col card-img-items" id = "' +
        // data[i]["id"] +
        // '"><div class="card">' +
        // '<a href="' +
        // imgUrl +
        // '">' +
        // '<img src="' +
        // imgUrlCover +
        // ' "class="img-thumbnail card-img-top img-fluid"' +
        // 'alt="' +
        // data[i]["title"] +
        // '"/></a>' +
        // '<div class="card-body">' +
        // '<h6 class="card-title">' +
        // data[i]["title"] +
        // "</h6>" +
        // '<p class="card-text">' +
        // extraText +
        // "</p></div></div></div>";
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
        '"</h5><h6 class="card-subtitle mb-2 text-muted">"' +
        extra +
        '</h6><p class="card-text">' +
        extraText +
        "</p></div></div></div>";
    }

    // 输出
    $("#Card-img").html(rstHtml);

    if ($.inArray("header", reLoadList) >= 0) {
      $("#rstHeaderShow").html(headerHtml);
    }

    reMainJs(jQuery, reLoadList);
  } else {
    $("#main").html(btnGetHTML("none"));
    reMainJs(jQuery, ["main"]);
  }
}
