$(document).ready(function () {
    let currentPage = 1; // 當前顯示的頁數
    const itemsPerPage = 5; // 每頁顯示的數量
    let searchResults = []; // 儲存搜尋結果

    // 確保 SEARCH_DATASET 存在
    if (typeof SEARCH_DATASET === "undefined") {
        console.error("❌ SEARCH_DATASET 未定義，請確認 search_dataset.js 已正確載入。");
        return;
    }

    console.log("✅ SEARCH_DATASET 成功載入，包含 " + SEARCH_DATASET.length + " 筆資料");

    // 監聽搜尋按鈕點擊事件
    $("#search-button").click(function () {
        let query = $("#search-box").val();
        console.log("搜尋框內容：", query);

        if (!query) {
            console.error("❌ 搜尋框是空的！");
            $("#search-results").html("<p>請輸入搜尋關鍵字。</p>");
            return;
        }

        query = query.trim(); // 這裡才執行 trim()
        console.log("🔍 搜尋關鍵字 (去空格後)：", query);

        // 執行搜尋 (忽略大小寫)
        searchResults = SEARCH_DATASET.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.text.toLowerCase().includes(query.toLowerCase())
        );

        console.log("🔎 找到 " + searchResults.length + " 筆符合的結果");

        // 更新統計數
        $("#results-counter").text(`✅ 共找到 ${searchResults.length} 筆項目`);

        // 重置分頁
        currentPage = 1;
        displayResults();
    });

    // 顯示搜尋結果 (控制每次只顯示 5 筆)
    function displayResults() {
        let resultsContainer = $("#search-results");
        resultsContainer.empty(); // 清空舊的搜尋結果

        if (searchResults.length === 0) {
            resultsContainer.html("<p>❌ 未找到符合的結果。</p>");
            return;
        }

        let start = (currentPage - 1) * itemsPerPage;
        let end = start + itemsPerPage;
        let paginatedResults = searchResults.slice(start, end); // 取當前頁數範圍的資料

        let resultHTML = "";
        paginatedResults.forEach(item => {
            resultHTML += `
                <div class="search-result">
                    <h3><a href="${item.url}" target="_blank">${item.title || "無標題"}</a></h3>
                    <p>${item.text}</p>
                </div>
            `;
        });

        resultsContainer.append(resultHTML); // 插入新的結果

        // 檢查是否還有更多結果
        if (end < searchResults.length) {
            $("#load-more-button").show(); // 如果還有未顯示的項目，顯示「顯示更多」按鈕
        } else {
            $("#load-more-button").hide(); // 否則隱藏按鈕
        }
    }

    // 監聽「顯示更多」按鈕點擊事件
    $("#load-more-button").click(function () {
        currentPage++; // 增加頁數
        displayResults();
    });
});
