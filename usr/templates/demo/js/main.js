function getRank(mode = "day", grpIdx = 0) {
  $.ajax({
    type: "GET",
    url: "api/biu/get/rank/",
    data: {
      mode: mode,
      totalPage: tmpSearchSettings["pixivbiu_searchPageNum"],
      groupIndex: Number(grpIdx),
    },
    success: function (rep) {
      rep = jQuery.parseJSON(JSON.stringify(rep));
      if (rep.code) {
        tmpPageData = rep.msg;
        console.log("排行榜@" + mode);
      } else {
        console.log("排行榜@" + mode);
      }
    },
    error: function (e) {
      console.log("排行榜@" + mode);
    },
  });
}
