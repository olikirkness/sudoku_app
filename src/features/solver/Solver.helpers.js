const Tesseract = window.Tesseract;

export const updateAutoCompletableLines = boxes => {
    let arrOfCols = [];
    let arrOfRows = [];

    [[0, 3, 6], [0, 3, 6], [0, 3, 6]].map(([ra, rb, rc], ind) => {
        [0, 1, 2].map(i => {
            arrOfCols = [
                ...arrOfCols,
                [
                    { b: ra + i, c: ra + ind, v: boxes[ra + i][ra + ind] },
                    { b: ra + i, c: rb + ind, v: boxes[ra + i][rb + ind] },
                    { b: ra + i, c: rc + ind, v: boxes[ra + i][rc + ind] },
                    { b: rb + i, c: ra + ind, v: boxes[rb + i][ra + ind] },
                    { b: rb + i, c: rb + ind, v: boxes[rb + i][rb + ind] },
                    { b: rb + i, c: rc + ind, v: boxes[rb + i][rc + ind] },
                    { b: rc + i, c: ra + ind, v: boxes[rc + i][ra + ind] },
                    { b: rc + i, c: rb + ind, v: boxes[rc + i][rb + ind] },
                    { b: rc + i, c: rc + ind, v: boxes[rc + i][rc + ind] }
                ]
            ];
        });
    });
    [[0, 1, 2], [0, 1, 2], [0, 1, 2]].map(([ra, rb, rc], i) => {
        [0, 3, 6].map(num => {
            arrOfRows = [
                ...arrOfRows,
                [
                    { b: ra + i * 3, c: ra + num, v: boxes[ra + i * 3][ra + num] },
                    { b: ra + i * 3, c: rb + num, v: boxes[ra + i * 3][rb + num] },
                    { b: ra + i * 3, c: rc + num, v: boxes[ra + i * 3][rc + num] },
                    { b: rb + i * 3, c: ra + num, v: boxes[rb + i * 3][ra + num] },
                    { b: rb + i * 3, c: rb + num, v: boxes[rb + i * 3][rb + num] },
                    { b: rb + i * 3, c: rc + num, v: boxes[rb + i * 3][rc + num] },
                    { b: rc + i * 3, c: ra + num, v: boxes[rc + i * 3][ra + num] },
                    { b: rc + i * 3, c: rb + num, v: boxes[rc + i * 3][rb + num] },
                    { b: rc + i * 3, c: rc + num, v: boxes[rc + i * 3][rc + num] }
                ]
            ];
        });
    });

    const nums = [...Array(9)].map((_, i) => i + 1);

    arrOfCols.map((col, i) => {
        if (col.filter(a => a.v).length === 8) {
            const cols = col.map(c => c.v);
            const missingCel = col.find(k => !k.v);
            nums.map(num => {
                if (!cols.includes(num)) {
                    boxes[missingCel.b][missingCel.c] = num;
                }
            });
        }
        const row = arrOfRows[i];
        if (row.filter(a => a.v).length === 8) {
            const rows = row.map(c => c.v);
            const missingRow = row.find(k => !k.v);
            nums.map(num => {
                if (!rows.includes(num)) {
                    boxes[missingRow.b][missingRow.c] = num;
                }
            });
        }
    });

    return boxes;
};

export const handleFindNextSearch = (
    boxIndex,
    itemIndex,
    testNumber,
    boxes,
    missingNums,
    stopped,
    i,
    callback,
    successCallback
) => {
    if (stopped) return;
    i += 1;
    const increment = num => num + Math.round(Math.random());
    boxIndex = increment(boxIndex);
    itemIndex = increment(itemIndex);
    testNumber = missingNums[Math.round(Math.random() * missingNums.length)];

    if (testNumber > 9) {
        callback(boxIndex, itemIndex, 1, boxes, null, i);
        return;
    }
    if (boxIndex >= 9) {
        callback(0, itemIndex, testNumber, boxes, null, i);
        return;
    }
    if (itemIndex >= 10) {
        callback(boxIndex, 0, testNumber, boxes, null, i);
        return;
    }
    if (boxes[boxIndex][itemIndex] || boxes[boxIndex].includes(testNumber)) {
        callback(boxIndex, itemIndex, testNumber, boxes, null, i);
        return;
    }

    findResult(boxIndex, itemIndex, testNumber, boxes, missingNums, callback, i, successCallback);
    return;
};

export const findResult = (boxIndex, itemIndex, searchingFor, boxes, missingNums, callback, i, successCallback) => {
    const boxColIndex = boxIndex % 3;
    const boxRowIndex = Math.floor(boxIndex / 3);

    let rowsToIgnore = [];
    let colsToIgnore = [];

    boxes.map((arr, index) => {
        if (arr.includes(searchingFor)) {
            if (boxRowIndex === Math.floor(index / 3)) {
                const row = boxRowIndex * 3 - Math.floor(index / 3) * 3 + Math.floor(arr.indexOf(searchingFor) / 3);
                rowsToIgnore = [...rowsToIgnore, row];
            }
        }
        if (arr.includes(searchingFor)) {
            if (boxColIndex === index % 3) {
                const col = boxColIndex * 3 - (index % 3) * 3 + (arr.indexOf(searchingFor) % 3);
                colsToIgnore = [...colsToIgnore, col];
            }
        }
    }, []);

    const box = boxes[boxIndex].reduce((sum, item, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);

        return !rowsToIgnore.includes(row) && !colsToIgnore.includes(col) && !item ? [...sum, { item, i }] : sum;
    }, []);

    if (box.length === 1) {
        boxes = boxes.map((b, index) =>
            index === boxIndex ? b.map((item, i) => (i === box[0].i ? searchingFor : item)) : b
        );

        missingNums.splice(missingNums.indexOf(searchingFor), 1);

        if (boxes[boxIndex].filter(n => n).length === 8) {
            const numbers = [...Array(9)].map((_, i) => i + 1);
            const missingNum = numbers.find(n => !boxes[boxIndex].includes(n));
            boxes = boxes.map((b, index) => (index === boxIndex ? b.map((item, i) => (!item ? missingNum : item)) : b));
        }

        boxes = updateAutoCompletableLines(boxes);

        if (boxes.every(b => b.every(i => i))) {
            successCallback(boxes);
            return;
        }

        callback(boxIndex, itemIndex, searchingFor, boxes, missingNums, i);
        return;
    }
    callback(boxIndex, itemIndex, searchingFor, boxes, missingNums, i);

    return;
};

export const getArrayDiff = (a1, a2) => {
    const diff = {};

    a1.map(field => (diff[field] = null));
    a2.map(field => (diff[field] = null));

    return Object.keys(diff);
};

export const tesseract = (image, callback) => {
    Tesseract.recognize(image, {
        lang: "eng",
        tessedit_char_whitelist: "123456789",
        edges_max_children_per_outline: 1
    }).finally(result => {
        const { symbols, blocks } = result;

        if (symbols) {
            const blockSizeX = (blocks[0].bbox.x1 - blocks[0].bbox.x0) / 9;
            const blockSizeY = (blocks[0].bbox.y1 - blocks[0].bbox.y0) / 9;
            const xb = blocks[0].bbox.x0;
            const yb = blocks[0].bbox.y0;

            const xBox = word => Math.floor((word.bbox.x0 - xb) / blockSizeX);
            const yBox = word => Math.floor((word.bbox.y0 - yb) / blockSizeY);
            const data = symbols.reduce(
                (sum, word) =>
                    word.confidence > 50 && parseInt(word.text)
                        ? [
                              ...sum,
                              {
                                  value: parseInt(word.text),
                                  inBoxIndex: (xBox(word) % 3) + 3 * (yBox(word) % 3),
                                  boxIndex: 3 * Math.floor(yBox(word) / 3) + Math.floor(xBox(word) / 3)
                              }
                          ]
                        : sum,
                []
            );

            const boxes = [...Array(9)].map(() => [...Array(9)]);
            data.map(num => (boxes[num.boxIndex] ? (boxes[num.boxIndex][num.inBoxIndex] = num.value) : null));
            const nums = data.map(v => `${v.boxIndex}-${v.value}`);
            const allNums = [...Array(9)].reduce(
                (sum, _, i) => [...sum, ...[...Array(9)].map((_, ind) => `${ind}-${i + 1}`)],
                []
            );
            const missingNums = getArrayDiff(nums, allNums).map(k => parseInt(k.split("-")[1]));
            return callback({
                boxes,
                missingNums,
                original: boxes,
                start: new Date(),
                end: null
            });
        }
    });
};
