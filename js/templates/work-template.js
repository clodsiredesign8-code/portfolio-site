// 1.非同期処理ができる関数init()を定義
async function init() {
  // =======1-1.まず、それぞれのファイル（作品のHTML、テンプレートのHTML、作品のJSONデータ）をJSでつなぐ作業================
  // 準備：取得したいjsonファイルの名前を現在のファイル名をもとに作成し、workNameに代入しておく
  const workName = location.pathname.split("/").pop().replace(".html","");

  // 手順1：templateにHTMLのテンプレートを取得してきたレスポンスオブジェクト（箱）を代入し、
  // await fetch()を使って代入されるまで待つ
  // Works pages live one directory below the site root. Keep these URLs
  // relative to that root so the site also works from a GitHub Pages project path.
  const template = await fetch("../templates/work-template.html");
  if (!template.ok) {
    throw new Error(`Failed to load work template: ${template.status} ${template.url}`);
  }
  // 手順2：レスポンスオブジェクトのテキスト（中身）をhtmlに代入
  const html = await template.text();
 
  // 手順3：同じようにawait fetch()で現在のHTMLファイルと同じ名前のJSONファイルを取ってくる
  const response = await fetch(`../data/${workName}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load work data: ${response.status} ${response.url}`);
  }
  // 手順4：JSONファイルの中身のデータをdataに代入
  const data = await response.json();

  // 手順5：HTMLの入れ込み作業：HTMLファイルのwork-body要素の中身に手順1.2で作ったhtmlを代入
  document.getElementById("work-body").innerHTML = html;

  // ====================ここからが入れ込み用の指示====================
  // ==================================2.タイトル・サムネ・作品概要セクション============================
  // 手順5で入れたHTMLの中のwork-titleというIdの場所の中身を、JsonデータのworkTitleというキーの値にする
  document.getElementById("work-title").textContent = data.workTitle;
  document.getElementById("work-one-phrase").textContent = data.workOnePhrase;
  // ボタンの表示とURL
  const workLink = document.getElementById("work-link");
  if(data.workLink) {
    workLink.href = data.workLink;
    workLink.hidden = false;
  } else {
    workLink.hidden = true;
  }
  
  

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


  // =============================3.説明セクション================================================
  // ===3-1.説明セクションセット用の関数renderRepeatedElements()を定義======================================================
  // 関数の処理：繰り返し処理でJSONデータの配列数分、要素にデータを入れる作業を行う。
  // 具体的には、1.ブロックを作る　2.ブロック内の要素を入れる　3.ブロックを追加

  function renderRepeatedElements(target) {
    // ==========================3-1-1.準備======================================
    // ⑴繰り返したい場所（appendChildで要素を一番下に追加していく場所）
    const targetSection = document.getElementById(`work-${target}-section`);

    // ⑵繰り返したい要素
    const descriptionSet = targetSection.querySelector(".work-description-set");

    // ⑶JSONファイルの指定用にターゲットの文字列の頭文字を大文字にしたcapitalizedTargetを定義しておく
    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const capitalizedTarget = capitalize(target);

    // ⑷JSONファイルの"workターゲットsection"というキーの値をtargetArrayという変数に代入
    const targetArray = data[`work${capitalizedTarget}Section`]


    // =======================3-1-2.メインの処理：foreach文=========================
    // JSONファイルのターゲットの配列のデータと何番目かを使ってセットの中身をアイテム数分入れる処理を行う
    targetArray.forEach((targetItem, index) => {
    
      // 処理1：HTMLの雛形を用意、if文で1つ目の雛形は元々あるやつ、2つ目以降は複製したもの
      let targetBlock;
      if (index === 0) {
        // 1つ目は元のHTML要素を使う
        targetBlock = descriptionSet;
      } else {
        // 配列が2つ目以降はクローンを作る
        targetBlock = descriptionSet.cloneNode(true);
      }

      // 処理2：HTML要素に各データを入れていく（ここでもJSONのキーを指定するためcapitalizedTargetが必要になる）
      // ⑴見出し
      targetBlock.querySelector(`.work-${target}-heading`).textContent = targetItem[`work${capitalizedTarget}Heading`];
      
      // ⑵説明文
      targetBlock.querySelector(`.work-${target}-text`).textContent = targetItem[`work${capitalizedTarget}Text`];
      
      // ⑶画像：if文でImg要素があるかないかで条件分岐（undefinedやnullの場合自動でFalseになる）
      if (targetItem[`work${capitalizedTarget}Img`]) {
        // ある場合
        const workTargetImg = targetBlock.querySelector(`.work-${target}-img`);
        // ⑶-1.画像のパス
        workTargetImg.src = targetItem[`work${capitalizedTarget}Img`]
        // ⑶-2.alt属性
        workTargetImg.alt = targetItem[`work${capitalizedTarget}Heading`]      
      } else {
        // ない場合
        // media要素自体を隠す
        targetBlock.querySelector(".work-description-media").hidden = true;
        // content要素の横幅を100%にする
        targetBlock.querySelector(".work-description-content").classList.add("full-width");
      }

      // 処理3：個別で設定したいCSS用にセットごとに個別idを振る
      targetBlock.id = `${target}-${index}`;

      // 処理4：indexが0でなければいま作ったtargetBlockを要素内に追加
      if ( index !== 0){
        targetSection.appendChild(targetBlock);
      }
    });
  }
  // ===3-2.説明セクションの入れ込み関数の実行=======================================================
  // アピールポイント、デザイン、スキルセクションで同じ関数を実行するため、ターゲットを定義してfor文の繰り返し処理にすることができる

  const targets = ["appeal", "design", "skill"];

  for (const target of targets) {
    renderRepeatedElements(target);
  }

  // ============================4.全体表示セクション====================================
  // 全体の流れ：PCSP両方なし・両方あり・PCのみなし・SPのみなし、の4条件分岐で表示を変える
  // 4-1.準備
  const fullviewSection = document.getElementById("work-fullview-section");
  const pcImg = document.getElementById("work-pc-img");
  const spImg = document.getElementById("work-sp-img");

  const pcTab = document.querySelector(`[data-target="pc-panel"]`);
  const spTab = document.querySelector(`[data-target="sp-panel"]`);

  const pcPanel = document.getElementById("pc-panel");
  const spPanel = document.getElementById("sp-panel");

  // 4-2.if文で条件分岐
  if (!data.workPcImg && !data.workSpImg) {
    // 分岐1：両方ない場合
    fullviewSection.hidden = true;
  } else {
    // 分岐2：どっちかでもある場合はそれぞれあるか確かめてからパスを入れる
    if(data["workPcImg"]) {
      pcImg.src = data["workPcImg"];
    }
    if(data["workSpImg"]) {
      spImg.src = data["workSpImg"];
    }

    // 分岐3：その上で、pcがなかった時はpcのタブとパネルを隠し、SPのタブとパネルにis-activeクラスを追加
    if (!data.workPcImg) {
      // PCのタブとパネルを隠して非選択状態にする
      pcTab.hidden = true;
      pcTab.classList.remove("is-active");
      pcPanel.hidden = true;
      pcPanel.classList.remove("is-active");
      // SPのタブとパネルを選択状態にする
      spTab.classList.add("is-active");
      spPanel.classList.add("is-active");
    };

    // 分岐4：spがなかったらspのタブとパネルを隠す
    if(!data.workSpImg) {
      spTab.hidden = true;
      spPanel.hidden = true;
      // 元々PCにis-activeがあるので隠すだけでOK
    };
  };

  // 4-3.work.jsで定義したinitFullviewTabs()関数を実行
  initFullviewTabs();
};

init();
