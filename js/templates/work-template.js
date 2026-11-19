// 非同期処理ができる関数init()を定義
async function init() {
  // =======まず、それぞれのファイル（作品のHTML、テンプレートのHTML、作品のJSONデータ）をJSでつなぐ作業================
  // 準備：取得したいjsonファイルの名前を現在のファイル名をもとに作成し、workNameに代入しておく
  const workName = location.pathname.split("/").pop().replace(".html","");

  // 手順1：templateにHTMLのテンプレートを取得してきたレスポンスオブジェクト（箱）を代入し、
  // await fetch()を使って代入されるまで待つ
  const template = await fetch("../../templates/work-template.html");
  // 手順2：レスポンスオブジェクトのテキスト（中身）をhtmlに代入
  const html = await template.text();
 
  // 手順3：同じようにawait fetch()で現在のHTMLファイルと同じ名前のJSONファイルを取ってくる
  const response = await fetch(`../../data/${workName}.json`);
  // 手順4：JSONファイルの中身のデータをdataに代入
  const data = await response.json();

  // 手順5：HTMLの入れ込み作業：HTMLファイルのwork-body要素の中身に手順1.2で作ったhtmlを代入
  document.getElementById("work-body").innerHTML = html;

  // ====================ここからが入れ込み用の指示====================
  // ===================================タイトル・サムネ・作品概要セクション============================
  // 手順5で入れたHTMLの中のwork-titleというIdの場所の中身を、JsonデータのworkTitleというキーの値にする
  document.getElementById("work-title").textContent = data.workTitle;
  document.getElementById("work-one-phrase").textContent = data.workOnePhrase;

  // サムネイル
  document.getElementById("work-overview-img").src = data.workOverviewImg;
  document.getElementById("work-overview-img").alt = data.workTitle;
  
  // 作品概要
  document.getElementById("work-category").textContent = data.workCategory;
  document.getElementById("work-period").textContent = data.workPeriod;
  document.getElementById("work-role").textContent = data.workRole;
  document.getElementById("work-skill").textContent = data.workSkill;
  document.getElementById("work-purpose").textContent = data.workPurpose;
  document.getElementById("work-target").textContent = data.workTarget;


  // =========================================説明セクション======================================================
  // 全体の流れ：繰り返し処理でJSONデータの配列数分、要素にデータを入れる作業を行う。
  // 具体的には、1.ブロックを作る　2.ブロック内の要素を入れる　3.ブロックを追加

  // 準備：繰り返し処理をしたい場所のHTML要素と、繰り返したい要素をそれぞれ編集に代入
  // ⑴繰り返したい場所（appendChildで要素を一番下に追加していく場所）
  const appealSection = document.getElementById("work-appeal-section");
  // ⑵繰り返したい要素
  const descriptionSet = appealSection.querySelector(".work-description-set");

  // メインの処理：foreach文
  // JSONファイルのアピールの配列のデータと何番目かを使って処理してくよ
  data.workAppeals.forEach((workAppeal, index) => {
    // 処理1：HTMLの雛形を用意、if文で1つ目の雛形は元々あるやつ、2つ目以降は複製したやつ
    let appealBlock;
    if (index === 0) {
      // 1つ目は元のHTML要素を使う
      appealBlock = descriptionSet;
    } else {
      // 配列が2つ目以降はクローンを作る
      appealBlock = descriptionSet.cloneNode(true);
    }

    // 処理2：HTML要素に各データを入れていく
    // ⑴見出し
    appealBlock.querySelector(".work-appeal-heading").textContent = workAppeal.workAppealHeading;
    // ⑵説明文
    appealBlock.querySelector(".work-appeal-text").textContent = workAppeal.workAppealText;
    // ⑶画像：そもそもImg要素があるかないかで判断できる（undefinedやnullの場合自動でFalseになる）
    if (workAppeal.workAppealImg) {
      // ある場合
      const workAppealImg = appealBlock.querySelector(".work-appeal-img");
      // ⑶-1.画像のパス
      workAppealImg.src = workAppeal.workAppealImg
      // ⑶-2.alt属性
      workAppealImg.alt = workAppeal.workAppealHeading
    } else {
      // ない場合
      // media要素自体を隠す
      appealBlock.querySelector(".work-description-media").hidden = true;
      // content要素の横幅を100%にする
      appealBlock.querySelector(".work-description-content").classList.add("full-width");
    }

    // 処理3：indexが0でなければいま作ったappealBlockを要素内に追加
    if ( index !== 0){
      appealSection.appendChild(appealBlock);
    }
  });

  // ===================================デザインセクション=============================
  // アピールセクションと同様の書き方をする

}

init();
