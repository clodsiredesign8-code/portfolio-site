// 全体像のタブ切り替えのJS処理
// 1.タブ切り替えの関数を定義
function initFullviewTabs(){
  // 1-1.準備タブとパネルをすべて取得
  const fullviewTabs = document.querySelectorAll(".fullview-tab");
  const fullviewPanels = document.querySelectorAll(".fullview-panel");

  // 1-2.タブをクリックした時の処理をforeachを使い、それぞれのタブに登録しておく
  // 登録だけなので、押されなければこの処理は走らないし、押されてないほうがクリックイベントが発生しない
  fullviewTabs.forEach((tab) => {    

    tab.addEventListener("click", ()=>{
  
      // クリック時処理1:両方のtabのis-activeを削除(初期化)
      fullviewTabs.forEach((tab) => {
        tab.classList.remove("is-active");
      });
    
      // クリック時処理2：すべてのパネルからis-activeを削除（初期化）
      fullviewPanels.forEach((panel) => {
        panel.classList.remove("is-active");
      });

      // クリック時処理3：クリックしたtabにis-activeを追加
      tab.classList.add("is-active");

      // クリック時処理4：クリックしたtabのdata-targetを取得
      const targetId = tab.dataset.target;

      // クリック時処理5:対応するパネルを取得
      const targetPanel = document.getElementById(targetId);

      // クリック時処理6：targetPanelにis-activeを追加
      targetPanel.classList.add("is-active");
    
    // addEventListenerを閉じる
    });
  // forEachを閉じる
  }); 
// 関数を閉じる
};