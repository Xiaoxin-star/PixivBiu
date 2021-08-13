var tmpCode;
var tmpPageData;
var types_of;
var tmpSearchSettings = {};
var downloadList = {};
//图片列表（可以替换成网络图片，图片越多效果越明显）
var imgList = [];
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
      totalPage: 1,
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

function showPics(
  title = "",
  reLoadList = ["main", "header"],
  c = tmpPageData
) {
  let rstHtml = "",
    kt;

  $(".progress.bar").css("width", "0%");
  $(".progress").removeClass("invisible");
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
      // 图片预加载
      imgList.push(imgUrlCover);
      //图片加载方法
      function load(imgSrc, callback) {
        var imgs = [];
        var c = 0;
        for (var i = 0; i < imgSrc.length; i++) {
          imgs[i] = new Image();
          imgs[i].src = imgSrc[i];
          imgs[i].onload = function () {
            c++;
            if (callback) {
              callback(c, imgSrc);
            }
          };
        }
        return imgs;
      }
      //需要操作这里的方法
      function imgStatus(n, imgSrc) {
        // 显示进度条
        //加载进度百分比 (加载数量 / 图片数量 * 100)
        var loadImgNum = parseInt(
          parseFloat(n / imgSrc.length).toFixed(2) * 100
        );
        //做加载动画处理
        console.log(loadImgNum);
        $(".progress-bar").css("width", loadImgNum + "%");
        //如果加载完成执行
        if (n == imgSrc.length) {
          console.log("ok");
          $(".progress-bar").css("width", "100%");
          // 输出
          $("#img-items").html(rstHtml);
          // 重载js文件
          $.getScript(
            "https://cdn.jsdelivr.net/npm/masonry-layout@4.2.2/dist/masonry.pkgd.min.js"
          );
          // 加载完成隐藏进度条
          setTimeout(function () {
            $(".progress").addClass("invisible");
          }, 1500);
        }
      }

      // 合成文本
      rstHtml +=
        '<div class="col-sm-6 col-lg-3 "><div class="card mb-2"><a href=""><img id="' +
        data[i]["id"] +
        ' " loading ="lazy" src="' +
        imgUrlCover +
        '"class="card-img-top" alt="' +
        data[i]["title"] +
        '" /></a><div class="card-body">' +
        ' <a href=""><h5 class="card-title ">' +
        data[i]["title"] +
        '</h5></a><p class="card-text ">' +
        data[i]["caption"] +
        ' </p><a href="">' +
        '<p class="card-text"><img style="margin-right: 10px;" class="rounded-circle" width="20px" height="20px" loading ="lazy" src="' +
        imgUrl +
        '"alt="Avatar" />' +
        data[i]["author"]["account"] +
        '<small class=" text-muted float-end">' +
        data[i]["created_time"] +
        '</small><h6 class="card-subtitle mb-2 text-muted align-middle" id="' +
        data[i]["author"]["id"] +
        '"></h6> </p></a></div> </div> </div>';
    }
    //调用预加载
    load(imgList, imgStatus);
    $(".img").hide();
  }
}
