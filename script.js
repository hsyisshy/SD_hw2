$(document).ready(function () {
    // 確保 SEARCH_DATASET 存在
    if (typeof SEARCH_DATASET === "undefined") {
        console.error("SEARCH_DATASET 未定義，請確認 search_dataset.js 已正確載入。");
        return;
    }

    // 監聽搜尋按鈕點擊事件
    $("#search-button").click(function () {
        let query = $("#search-box").val().trim(); // 取得搜尋框內容

        if (query === "") {
            $("#search-results").html("<p>請輸入搜尋關鍵字。</p>");
            return;
        }

        // 篩選資料集，找出符合條件的項目
        let results = SEARCH_DATASET.filter(item =>
            item.title.includes(query) || item.text.includes(query)
        );

        // 更新搜尋結果
        displayResults(results);
    });

    // 顯示搜尋結果
    function displayResults(results) {
        let resultsContainer = $("#search-results");
        resultsContainer.empty(); // 清空舊的搜尋結果

        if (results.length === 0) {
            resultsContainer.html("<p>未找到符合的結果。</p>");
            return;
        }

        let resultHTML = "";
        results.forEach(item => {
            resultHTML += `
                <div class="search-result">
                    <h3><a href="${item.url}" target="_blank">${item.title || "無標題"}</a></h3>
                    <p>${item.text}</p>
                </div>
            `;
        });

        resultsContainer.html(resultHTML); // 插入新的結果
        $("#results-counter").text(`共找到 ${results.length} 筆項目`);
    }
});