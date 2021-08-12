var tmpCode;
var tmpPageData;
var types_of;
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
// 搜索页码
var tatalpage = $(".tatalpage").val();
// 推荐插画
// content_type: [illust, manga]
function recommend(type = "illust") {
  $.ajax({
    url: "api/biu/get/recommend/",
    type: "GET",
    data: {
      type: type,
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
}

$("#types-of option").click(function () {
  types_of = $("#types-of").val();

  switch (Number(types_of)) {
    case 1:
      $(".search-text").attr("placeholder", "请输入搜索关键字");
      break;
    case 2:
      $(".search-text").attr("placeholder", "请输入用户名");
      break;
    case 3:
      $(".search-text").attr("placeholder", "请输入作品ID");
      break;
    default:
      $(".search-text").attr("placeholder", "请输入作者ID");
      break;
  }
});

// 搜索
$("#Search").click(function () {
  // 搜索关键字
  var search_text = $(".search-text").val();

  // 类型
  types_of = $("#types-of").val();
  // $(".search-text").val(null);
  switch (Number(types_of)) {
    case 1:
      // 搜索
      // /api/biu/search/works/?kt=幼女&mode=tag&totalPage=5&isCache=1&groupIndex=0&sortMode=0
      $.ajax({
        url: "api/biu/search/works/",
        type: "GET",
        data: {
          kt: search_text,
          mode: "tag",
          totalPage: tatalpage,
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
      break;
    case 2:
      // 用户搜索
      ///api/biu/search/users/?kt={user_name}&totalPage=5&groupIndex=0
      $.ajax({
        url: "api/biu/search/users/",
        type: "GET",
        data: {
          kt: search_text,
          totalPage: tatalpage,
          groupIndex: 0,
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
      break;
    case 3:
      // 指定作品ID
      ///api/biu/get/onework/?workID=%7Bwork_id%7D
      $.ajax({
        url: "api/biu/get/onework/",
        type: "GET",
        data: {
          workID: search_text,
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
      break;
    case 4:
      // 用户插画
      ///api/biu/get/idworks/?userID=%7Buser_id%7D&type=illust&sortMode=0&isSort=0&totalPage=5&groupIndex=0
      $.ajax({
        url: "api/biu/get/idworks/",
        type: "GET",
        data: {
          userID: search_text,
          type: "illust",
          sortMode: 0,
          isSort: 0,
          totalPage: tatalpage,
          groupIndex: 0,
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
      break;
    case 5:
      // 漫画
      ///api/biu/get/idworks/?userID=%7Buser_id%7D&type=manga&sortMode=0&isSort=0&totalPage=5&groupIndex=0
      $.ajax({
        url: "api/biu/get/idworks/",
        type: "GET",
        data: {
          userID: search_text,
          type: "manga",
          sortMode: 0,
          isSort: 0,
          totalPage: tatalpage,
          groupIndex: 0,
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
      break;
    case 6:
      // 收藏
      ///api/biu/get/idmarks/?userID=%7Buser_id%7D&restrict=public&sortMode=0&isSort=0&groupIndex=0&tmp=0%400
      $.ajax({
        url: "api/biu/get/idmarks/",
        type: "GET",
        data: {
          userID: search_text,
          restrict: "public",
          sortMode: 0,
          isSort: 0,
          groupIndex: 0,
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
      break;

    case 7:
      // 关注列表
      ///api/biu/get/idfollowing/?userID=%7Buser_id%7D&restrict=public&totalPage=5&groupIndex=0
      $.ajax({
        url: "api/biu/get/idfollowing/",
        type: "GET",
        data: {
          userID: search_text,
          restrict: "public",
          totalPage: tatalpage,
          groupIndex: 0,
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
      break;
  }
});

// 排行榜
// # mode(r18榜单需登录): [day_r18, day_male_r18, day_female_r18, week_r18, week_r18g]

function ranking_all(ranking_mode = "monthly", page = totalPage, date = null) {
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
      var imgUrlCover = data[i]["image_urls"]["large"].replace(
        "https://i.pximg.net",
        settingsMods["#settingsRvrProxyUrl"][1]
      );

      var imgUrl = data[i]["image_urls"]["large"].replace(
        "https://i.pximg.net",
        settingsMods["#settingsRvrProxyUrl"][1]
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
        '<div class="col-sm-6 col-lg-4 mb-4" id="' +
        data[i]["author"]["id"] +
        '><div class="card">' +
        '<img src="' +
        imgUrlCover +
        '" class="card-img-top" alt="' +
        imgUrl +
        '">' +
        '<div class="card-body"><h5 class="card-title">' +
        data[i]["author"]["title"] +
        '</h5> <p class="card-text">' +
        "This is a longer card with supporting text below as a natural" +
        "lead-in to additional content. This content is a little bit" +
        " longer." +
        "</p> </div></div></div>";
    }

    //   rstHtml +=
    //     '<div class="col-sm-6 col-lg-4"><div class="card mb-3"><a href=""><img id="' +
    //     data[i]["author"]["id"] +
    //     ' " loading ="lazy"src="' +
    //     imgUrlCover +
    //     '"class="card-img-top" alt="' +
    //     data[i]["title"] +
    //     '" /></a><div class="card-body">' +
    //     ' <a href=""><h5 class="card-title">' +
    //     data[i]["title"] +
    //     '</h5></a><p class="card-text">' +
    //     data[i]["caption"] +
    //     ' </p><a href="">' +
    //     '<p class="card-text"><img class="rounded-circle" width="20px" height="20px" loading ="lazy" src="' +
    //     imgUrl +
    //     '"alt="Avatar" />' +
    //     data[i]["author"]["account"] +
    //     '<small class="text-muted float-end">' +
    //     data[i]["created_time"] +
    //     '</small><h6 class="card-subtitle mb-2 text-muted align-middle" id="' +
    //     data[i][id] +
    //     '"></h6> </p></a></div> </div> </div>';
    // }

    // 输出
    $("#img-items").html(rstHtml);
    $(".img").hide();
    // 重载js文件
    // $.getScript(
    //   "https://cdn.jsdelivr.net/npm/masonry-layout@4.2.2/dist/masonry.pkgd.min.js"
    //   function () {
    //     newFun('"Checking new script"'); //这个函数是在new.js里面的，当点击click后运行这个函数
    //   }
    // );
    $(".progress-bar").animate("width", "100%");
  }
}
