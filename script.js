$(document).ready(function () {
    
    let currentPage = 1; 
    const itemsPerPage = 5; // 每頁顯示 5 筆資料
    let searchResults = []; // 儲存搜尋結果
    let selectedSort = "title";

    // 防呆：確認資料集是否已載入
    if (typeof SEARCH_DATASET === "undefined") {
        console.error("❌ SEARCH_DATASET 未定義，請確認 search_dataset.js 已正確載入。");
        return;
    }

    console.log("✅ SEARCH_DATASET 成功載入，包含 " + SEARCH_DATASET.length + " 筆資料");

    // 搜尋按鈕
    $("#search-button").click(function () {

        // 取得搜尋關鍵字
        let query = $("#search-box").val();
        console.log("搜尋框內容：", query);

        if (!query) {
            console.error("❌ 搜尋框是空的！");
            $("#search-results").html("<p>請輸入搜尋關鍵字。</p>");
            return;
        }

        query = query.trim(); // 防呆：去掉前後空白
        console.log("🔍 搜尋關鍵字 (去空格後)：", query);

        // 防呆：執行搜尋 (忽略大小寫)
        searchResults = SEARCH_DATASET.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.text.toLowerCase().includes(query.toLowerCase())
        );

        console.log("🔎 找到 " + searchResults.length + " 筆符合的結果");

        // 更新統計數
        $("#results-counter").text(`✅ 共找到 ${searchResults.length} 筆項目`);

        // 重置
        currentPage = 1;
        $("#search-results").empty(); // 先清空舊結果

        // 排序
        sortResults();

        // 顯示
        displayResults();
    });

    // 排序選單：避免有人搜尋完又改排序
    $("#category-order").change(function () {
        selectedSort = $(this).val(); // 選擇方式抓過來
        console.log("📌 變更排序方式：", selectedSort);

        // 重新排序 & 更新顯示
        sortResults();
        currentPage = 1;
        $("#search-results").empty();
        displayResults();
    });

    // 排序搜尋結果
    function sortResults() {
        if (selectedSort === "title") {
            searchResults.sort((a, b) => a.title.localeCompare(b.title, "zh-TW"));
        } else if (selectedSort === "created_at") {
            searchResults.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (selectedSort === "popularity") {
            searchResults.sort((a, b) => b.popularity - a.popularity); 
        }
        console.log("✅ 排序完成，依據：" + selectedSort);
    }

    // 顯示搜尋結果 (控制每次只顯示 5 筆，但不清除舊結果)
    function displayResults() {
        let start = (currentPage - 1) * itemsPerPage;
        let end = start + itemsPerPage;
        let paginatedResults = searchResults.slice(start, end); // 取當前頁數範圍的資料

        let resultHTML = "";
        paginatedResults.forEach(item => {
            resultHTML += `
                <div class="search-result">
                    <h3><a href="${item.url}" target="_blank">${item.title || "無標題"}</a></h3>
                    <p>${item.text}</p>
                    <p><strong>時間：</strong>${item.created_at}</p>
                    <p><strong>人氣：</strong>${item.popularity}</p>
                </div>
            `;
        });

        $("#search-results").append(resultHTML);

        // 檢查是否還有更多結果
        if (end < searchResults.length) {
            $("#load-more-button").show(); // 如果還有未顯示的項目，顯示「顯示更多」按鈕
        } else {
            $("#load-more-button").hide(); // 否則隱藏按鈕
        }
    }

    //顯示更多
    $("#load-more-button").click(function () {
        currentPage++;
        displayResults();
    });

});
