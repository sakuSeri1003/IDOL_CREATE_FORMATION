// =========================
// メンバーデータ
// =========================

let members = [];


// =========================
// 現在選択中の〇
// =========================

let currentCircle = null;


// =========================
// 要素取得
// =========================
// 作成ボタン
const createBtn = document.getElementById("createBtn");
// クリアボタン
const clearBtn = document.getElementById("clearBtn");
// フォーメーションエリア
const formationCanvas = document.getElementById("formationCanvas");
// 期生コンボボックス
const termSelect = document.getElementById("termSelect");
// メンバーコンボボックス
const memberSelect = document.getElementById("memberSelect");
// メンバー選択ダイアログ
const memberDialog = document.getElementById("memberDialog");
// ダイアログ閉じるボタン
const dialogCloseBtn = document.getElementById("dialogCloseBtn");
// 保存ボタン
const saveImageButton = document.getElementById("saveImageButton");

// =========================
// 初期処理
// =========================

initialize();


// =========================
// 初期処理
// =========================

function initialize() {

    // メンバー読込
    loadMembers();

    // 合計初期表示
    updateTotal();

    // イベント登録
    registerEvents();

}


// =========================
// イベント登録
// =========================

function registerEvents() {

    // 作成ボタン
    createBtn.addEventListener(
        "click",
        clickCreateButton
    );

    // クリアボタン
    clearBtn.addEventListener(
        "click",
        clickClearButton
    );

    // 1列目
    document.getElementById("row1")
        .addEventListener(
            "input",
            updateTotal
        );

    // 2列目
    document.getElementById("row2")
        .addEventListener(
            "input",
            updateTotal
        );

    // 3列目
    document.getElementById("row3")
        .addEventListener(
            "input",
            updateTotal
        );

    // 期生変更
    termSelect.addEventListener(
        "change",
        changeTerm
    );

    // メンバー変更
    memberSelect.addEventListener(
        "change",
        SetMenber
    );

    // 閉じる
    dialogCloseBtn.addEventListener(
        "click",
        clickCloseButton
    );

    // ダイアログ背景
    memberDialog.addEventListener(
        "click",
        clickDialogBackground
    );

    // 保存ボタンクリック
    saveImageButton.addEventListener(
        "click",
        saveFormationImage
    );

}


// =========================
// メンバー読込
// =========================

function loadMembers() {

    console.log("メンバー読込開始");

    fetch("members.json")
        .then(response => {

            console.log(response);

            return response.json();

        })
        .then(data => {

            console.log(data);

            members = data;

            // 期生生成
            createTermOptions();

        })
        .catch(error => {

            console.error(error);

        });

}


// =========================
// 合計更新
// =========================

function updateTotal() {

    const row1 =
        Number(
            document.getElementById("row1").value
        );

    const row2 =
        Number(
            document.getElementById("row2").value
        );

    const row3 =
        Number(
            document.getElementById("row3").value
        );

    const total =
        row1 + row2 + row3;

    document.getElementById(
        "totalCount"
    ).value = `${total}人`;

}


// =========================
// 期生OPTION生成
// =========================

function createTermOptions() {

    // 初期化
    termSelect.innerHTML = "";

    // 初期OPTION
    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent =
        "";

    termSelect.appendChild(
        defaultOption
    );

    // term取得
    const terms =
        [...new Set(
            members.map(
                member => member.term
            )
        )];

    // ソート
    terms.sort((a, b) => a - b);

    // OPTION追加
    terms.forEach(term => {

        const option =
            document.createElement("option");

        option.value = term;

        option.textContent = term;

        termSelect.appendChild(
            option
        );

    });

}


// =========================
// メンバー絞込
// =========================

function updateMemberOptions(selectedTerm, excludeIds = []) {

    // 初期化
    memberSelect.innerHTML = "";

    // 初期OPTION
    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent =
        "選択してください";

    memberSelect.appendChild(
        defaultOption
    );

    // 絞込後メンバー
    let filteredMembers = [];

    // すべて
    if (selectedTerm == "") {

        filteredMembers = members;

    }
    else {

        filteredMembers =
            members.filter(member => {

                return member.term ==
                    selectedTerm;

            });

    }

    // 使用済みメンバー除外
    filteredMembers =
        filteredMembers.filter(member => {

            return !excludeIds.includes(
                member.id.toString()
            );

        });

    // 名前順
    filteredMembers.sort((a, b) => {

        return a.Surname.localeCompare(
            b.Surname,
            "ja"
        );

    });

    // OPTION追加
    filteredMembers.forEach(member => {

        const option =
            document.createElement("option");

        option.value = member.id;

        option.textContent =
            `${member.Surname} ${member.name}`;

        memberSelect.appendChild(
            option
        );

    });

}


// =========================
// 作成ボタン
// =========================

function clickCreateButton() {

    // 人数取得
    const row1 =
        Number(
            document.getElementById("row1").value
        );

    const row2 =
        Number(
            document.getElementById("row2").value
        );

    const row3 =
        Number(
            document.getElementById("row3").value
        );

    // 初期化
    formationCanvas.innerHTML = "";

    // 表示順
    const rows = [

        {
            rowNumber: 3,
            count: row3
        },

        {
            rowNumber: 2,
            count: row2
        },

        {
            rowNumber: 1,
            count: row1
        }

    ];

    // 行生成
    rows.forEach(rowData => {

        const rowDiv =
            document.createElement("div");

        rowDiv.className =
            "formation-row";

        // 人数分
        for (
            let i = 0;
            i < rowData.count;
            i++
        ) {

            createCircle(
                rowDiv,
                rowData,
                i
            );

        }

        formationCanvas.appendChild(
            rowDiv
        );

    });

}

// =========================
// クリア
// =========================

function clickClearButton() {

    // 確認ダイアログ
    const result =
        confirm(
            "フォーメーションをすべて削除します。よろしいですか？"
        );

    // キャンセル
    if (!result) {

        return;

    }

    // フォーメーション削除
    formationCanvas.innerHTML = "";

    // 選択中サークル初期化
    currentCircle = null;

}

// =========================
// 〇生成
// =========================

function createCircle(
    rowDiv,
    rowData,
    index
) {

    // BOX
    const memberBox =
        document.createElement("div");

    memberBox.className =
        "member-box";

    // 〇
    const circle =
        document.createElement("div");

    circle.className =
        "member-circle";

    // 行番号
    circle.dataset.row =
        rowData.rowNumber;

    // INDEX
    circle.dataset.index =
        index + 1;

    // メンバーID
    circle.dataset.memberId = "";

    // 初期文字
    circle.textContent = "＋";

    // イベント
    circle.addEventListener(
        "click",
        clickCircle
    );

    // 追加
    memberBox.appendChild(circle);

    rowDiv.appendChild(memberBox);

}


// =========================
// 〇クリック
// =========================

function clickCircle(event) {

    const circle =
        event.currentTarget;

    currentCircle = circle;

    openDialog();

}


// =========================
// ダイアログ表示
// =========================

function openDialog() {

    // 使用中memberId取得
    const usedMemberIds = Array.from(
        document.querySelectorAll(".member-circle")
    )
        .map(circle => circle.dataset.memberId)
        .filter(id => id);

    // 現在編集中のメンバー
    const currentMemberId =
        currentCircle.dataset.memberId;

    // 自分自身は除外対象から外す
    const excludeIds =
        usedMemberIds.filter(id => {

            return id !== currentMemberId;

        });

    // メンバー表示
    updateMemberOptions("", excludeIds);

    // 期生初期化
    termSelect.value = "";

    // 現在値セット
    memberSelect.value = currentMemberId;

    // 表示
    memberDialog.style.display =
        "flex";

}


// =========================
// ダイアログ閉じる
// =========================

function closeDialog() {

    // 初期化
    termSelect.value = "";

    memberSelect.innerHTML = "";

    // 非表示
    memberDialog.style.display =
        "none";

}


// =========================
// 背景クリック
// =========================

function clickDialogBackground(event) {

    // 背景クリックのみ
    if (event.target === memberDialog) {

        closeDialog();

    }

}


// =========================
// 閉じるボタン
// =========================

function clickCloseButton() {

    closeDialog();

}


// =========================
// 期生変更
// =========================

function changeTerm() {

    const selectedTerm = termSelect.value;

    updateMemberOptions(selectedTerm);

}


// =========================
// メンバー変更
// =========================

function SetMenber() {

    // 未選択
    if (memberSelect.value == "") {

        currentCircle.dataset.memberId = "";
        currentCircle.textContent = "+";
        currentCircle.style.background = "";
        closeDialog();
        return

    }

    // メンバー取得
    const selectedMember =
        members.find(member => {

            return member.id ==
                memberSelect.value;

        });

    // 存在しない
    if (!selectedMember) {

        return;

    }

    // =========================
    // メンバーID保持
    // =========================

    currentCircle.dataset.memberId =
        selectedMember.id;


    // =========================
    // 苗字表示
    // =========================

    currentCircle.textContent =
        selectedMember.Surname;


    // =========================
    // 既存色リセット
    // =========================

    currentCircle.style.background = "";


    // =========================
    // CSSクラスから色取得
    // =========================

    if (
        selectedMember.color1 &&
        selectedMember.color2
    ) {

        // 一時要素生成
        const temp1 =
            document.createElement("div");

        const temp2 =
            document.createElement("div");

        // クラス付与
        temp1.className =
            selectedMember.color1;

        temp2.className =
            selectedMember.color2;

        // bodyへ追加
        document.body.appendChild(temp1);

        document.body.appendChild(temp2);

        // CSS色取得
        const color1 =
            getComputedStyle(temp1)
                .backgroundColor;

        const color2 =
            getComputedStyle(temp2)
                .backgroundColor;

        // 削除
        temp1.remove();

        temp2.remove();

        // =========================
        // 半分ずつ色設定
        // =========================

        currentCircle.style.background =
            `linear-gradient(
                90deg,
                ${color1} 0%,
                ${color1} 50%,
                ${color2} 50%,
                ${color2} 100%
            )`;

    }


    // =========================
    // 閉じる
    // =========================

    closeDialog();

}

/* =========================
   画像保存
========================= */
async function saveFormationImage() {

    // 保存対象
    const target =
        document.getElementById(
            "captureArea"
        );

    // 画像化
    const canvas =
        await html2canvas(target, {

            backgroundColor: null,

            useCORS: true,

            scale: 2
        });

    // Blob化
    const blob =
        await new Promise(resolve => {

            canvas.toBlob(resolve);

        });

    // タイトル
    const title =
        document.getElementById(
            "formationTitle"
        ).value || "formation";

    // ファイル名
    const fileName =
        `${title}.png`;

    // スマホ用
    const file =
        new File(
            [blob],
            fileName,
            {
                type: "image/png"
            }
        );

    // =========================
    // スマホ共有
    // =========================
    if (
        navigator.share &&
        navigator.canShare({
            files: [file]
        })
    ) {

        try {

            await navigator.share({

                files: [file],

                title: title
            });

        }
        catch (error) {

            console.log(error);

        }

        return;
    }

    // =========================
    // PC保存
    // =========================

    // File System Access API対応
    if (window.showSaveFilePicker) {

        try {

            const handle =
                await window.showSaveFilePicker({

                    suggestedName:
                        fileName,

                    types: [

                        {

                            description:
                                "PNG Image",

                            accept: {

                                "image/png":
                                    [".png"]
                            }
                        }
                    ]
                });

            const writable =
                await handle.createWritable();

            await writable.write(blob);

            await writable.close();

        }
        catch (error) {

            console.log(error);

        }

        return;
    }

    // 非対応ブラウザ
    const link =
        document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        fileName;

    link.click();

}