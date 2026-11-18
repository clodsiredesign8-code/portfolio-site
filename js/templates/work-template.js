// 非同期処理ができる関数init()を定義
async function init() {
  // 準備：取得するjsonファイルの名前をworkNameに代入しておく
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

  // ====================ここからが入れ込みようの指示=====================
  // 手順6：動的要素の入れ込み作業：
  // （例）タイトルセクション
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

  // アピールポイント

}

init();
