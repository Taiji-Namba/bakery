"use strict";
$(function () {
  // ローディング

  // ローディング背景フェードアウト
  function end_loader() {
    $("#loading").fadeOut(800);
  }
  // ロゴ表示
  function show_logo() {
    $("#loading-box").fadeIn(300);
  }
  // テキスト非表示
  function hide_logo() {
    $("#loading-box").fadeOut(300);
  }

  // 1.2秒後に強制的にローディングアニメーションを開始する (ローディングが上手くできなかったときの保険)
  var loadingTimeout = setTimeout(function () {
    setTimeout(function () {
      show_logo();
    }, 100);

    setTimeout(function () {
      hide_logo();
    }, 1000);

    setTimeout(function () {
      end_loader();
    }, 1900);
  }, 1200);

  // ローディングが完了したら
  $(window).on("load", function () {
    // iOSのGoogle Chromeでページ更新時にローディングアニメーションが始まらない問題を解決するため、手動でローディングを開始
    $(window).trigger("load");
    setTimeout(function () {
      show_logo();
    }, 100);

    setTimeout(function () {
      hide_logo();
    }, 1000);

    setTimeout(function () {
      end_loader();
    }, 1900);

    // ページのローディングが完了したら、アニメーションの強制開始をクリアする
    clearTimeout(loadingTimeout);
  });

  // グローバルナビの追従
  function FixedAnime() {
    // グローバルナビまでの高さの取得
    let gnavPos =
      $(".fv").outerHeight() +
      $(".header__logo-mark").outerHeight() / 2 +
      parseInt($(".header__logo-mark").css("margin-bottom"), 10);

    // ウィンドウの幅を取得
    let windowWidth = $(window).width();

    // ウィンドウの幅が1279px以下であれば追従しない
    if (windowWidth > 1279) {
      // グローバルナビの高さまでスクロールすると上部に固定する
      let scroll = $(window).scrollTop();
      if (scroll >= gnavPos) {
        $(".gnav").addClass("nav-fixed");
        $(".main__inner").css("padding-top", 120);
      } else {
        $(".gnav").removeClass("nav-fixed");
        $(".main__inner").css("padding-top", 20);
      }
    } else {
      // 幅が1279px以下の場合は追従を解除
      $(".gnav").removeClass("nav-fixed");
      $(".main__inner").css("padding-top", 20);
    }
  }

  // ページが読み込まれたらすぐに動かす
  $(window).scroll(function () {
    FixedAnime(); /* スクロール途中からヘッダーを出現させる関数を呼ぶ*/
  });

  // ウィンドウのリサイズ時にも処理を実行
  $(window).resize(function () {
    FixedAnime();
  });

  // Swiperの実装
  const slideLength = document.querySelectorAll(".swiper-slide").length;

  const initSwiper = () => {
    const swiper = new Swiper(".swiper", {
      loop: true,
      autoplay: {
        delay: 0,
        disableOnInteraction: false, // ユーザーが操作してもスライドを継続
        pauseOnMouseEnter: true, //マウスホバーで止まる
      },
      centeredSlides: true, //アクティブなスライドを中央に位置させる
      speed: 10000,
      loopSlides: slideLength,
      loopAdditionalSlides: slideLength,
      slidesPerView: 1.25,

      // ユーザーがドラッグしたときのスピード調整
      freeMode: {
        enabled: true,
        momentum: false,
      },
      on: {
        touchEnd: (swiper) => {
          swiper.slideTo(swiper.activeIndex + 1);
        },
      },

      breakpoints: {
        320: {
          slidesPerView: 1,
        },
        360: {
          slidesPerView: 1.2,
        },
        412: {
          slidesPerView: 1.3,
        },
        576: {
          slidesPerView: 1.8,
        },
        768: {
          slidesPerView: 2.6,
        },
        992: {
          slidesPerView: 3.5,
        },
        1280: {
          slidesPerView: 4.3,
        },
      },
    });
  };

  window.addEventListener("load", function () {
    initSwiper(); // ページ読み込み後に初期化
  });

  //ハンバーガーメニューの実装
  let scrollpos;

  //バーガーボタンを押したとき
  $(".burger-button").on("click", function () {
    if (!$(this).hasClass("open")) {
      $(".burger-button").addClass("open");
      $(".burger-menu").addClass("open");

      // スクロール位置を保持 & メニューopen時はスクロールできないように
      scrollpos = $(window).scrollTop();
      $("body").addClass("fixed").css({ top: -scrollpos });
    } else {
      $(".burger-button").removeClass("open");
      $(".burger-menu").removeClass("open");

      // メニューを閉じる時はfixを解除して元のスクロール位置に戻る
      $("body").removeClass("fixed").css({ top: 0 });
      window.scroll({
        top: scrollpos,
        left: 0,
        behavior: "instant",
      });
    }
  });

  // ハンバーガーメニュー表示時にメニュー以外をクリックしたらスクロール位置を保持したまま閉じる
  $(".burger-menu").on("click", function (event) {
    if (!$(event.target).is("a")) {
      $(".burger-button").removeClass("open");
      $(".burger-menu").removeClass("open");
      $("body").removeClass("fixed").css({ top: 0 });
      window.scroll({
        top: scrollpos,
        left: 0,
        behavior: "instant",
      });
    }
  });

  // escキーを押したときにハンバーガーメニューをスクロール位置を保持したまま閉じる
  window.onkeyup = function (event) {
    if (event.keyCode == "27") {
      if ($(".burger-button").hasClass("open")) {
        $(".burger-button").removeClass("open");
        $(".burger-menu").removeClass("open");

        // スクロール位置を保持しながら解除
        $("body").removeClass("fixed").css({ top: 0 });
        window.scroll({
          top: scrollpos,
          left: 0,
          behavior: "instant",
        });
      }
    }
  };

  // スムーススクロール(ハンバーガメニューを押したときも動作)
  $('a[href^="#"]').click(function () {
    if ($(this).hasClass("burger-menu__anchor")) {
      $(".burger-button").removeClass("open");
      $(".burger-menu").removeClass("open");
      $("body").removeClass("fixed").css({ top: 0 });
      window.scroll({
        top: scrollpos,
        left: 0,
        behavior: "instant",
      });
    }

    let adjust = $(".gnav").outerHeight(true);
    if ($(window).width() <= 1279) {
      adjust = 0;
    }
    let speed = 300;
    let href = $(this).attr("href");
    let target = $(href == "#" || href == "" ? "html" : href);

    let position = target.position().top - adjust;

    if (
      navigator.userAgent.indexOf("Safari") != -1 &&
      navigator.userAgent.indexOf("Chrome") == -1
    ) {
      speed = 500;
      // Safariのスクロールアニメーションの速度を調整
    }

    $("body,html").animate({ scrollTop: position }, speed, "linear");

    return false;
  });

  // アコーディオンメニュー
  $(".faq__question").on("click", function () {
    $(this).next().slideToggle();
    $(this).find(".faq__arrow").toggleClass("reverse");
  });
});
