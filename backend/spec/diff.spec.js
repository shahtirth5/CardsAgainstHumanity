const _ = require("lodash");
const {makeDiff, mergeDiff, IS_UNCHANGED} = require("../shared/diff");

runDiffTests({
    scalar: {
        "changed on numbers": [
            1, 2,
            2
        ],
        "unchanged on numbers": [
            1, 1,
            IS_UNCHANGED
        ],
        "changed on type": [
            1, "1",
            "1"
        ],
        "unchanged on null": [
            null, null,
            IS_UNCHANGED
        ],
    },
    array: {
        "throws an invalid type": () => {
            expect(() => makeDiff("whoa", [])).toThrow();
        },
        "unchanged on empty array": [
            [], [],
            IS_UNCHANGED
        ],
        "empties array": [
            [1, 2, 3], [],
            {$splice: [0, 3]}
        ],
        "simple": {
            "unchanged": [
                [1, 2, 3], [1, 2, 3],
                IS_UNCHANGED
            ],
            "splice": [
                [1, 2, 3], [1, 2, 4, 5],
                {$splice: [2, 1, 4, 5]}
            ],
            "add one at end": [
                [1, 2, 3], [1, 2, 3, 4],
                {$splice: [3, 0, 4]}
            ],
            "remove one at end": [
                [1, 2, 3], [1, 2],
                {$splice: [2, 1]}
            ],
            "remove one at middle": [
                [1, 2, 3], [1, 3],
                {$splice: [1, 2, 3]}
            ],
            "add to the end": [
                [1, 2, 3], [1, 2, 3, 4, 5, 6],
                {$splice: [3, 0, 4, 5, 6]}
            ]
        },
        "complex": {
            "unchanged": [
                [
                    {id: 1, text: "hey"},
                    {id: 2, text: "whats"},
                    {id: 3, text: "up"}
                ],
                [
                    {id: 1, text: "hey"},
                    {id: 2, text: "whats"},
                    {id: 3, text: "up"}
                ],
                IS_UNCHANGED
            ],
            "removes one": [
                [
                    {id: 1, text: "hey"},
                    {id: 2, text: "whats"},
                    {id: 3, text: "up"}
                ],
                [
                    {id: 1, text: "hey"},
                    {id: 2, text: "whats"}
                ],
                {$update: {}, ids: [1, 2]}
            ],
            "reorder": [
                [
                    {id: 1, text: "hey"},
                    {id: 2, text: "whats"}
                ],
                [
                    {id: 2, text: "whats"},
                    {id: 1, text: "hey"}
                ],
                {$update: {}, ids: [2, 1]}
            ],
            "update": [
                [
                    {id: 1, text: "hey"},
                    {id: 2, text: "whats"}
                ],
                [
                    {id: 1, text: "hey"},
                    {id: 2, text: "whats up"}
                ],
                {$update: {2: {text: "whats up"}}}
            ],
            "update and reorcer": [
                [
                    {id: 1, text: "hey"},
                    {id: 2, text: "whats"}
                ],
                [
                    {id: 2, text: "whats up"},
                    {id: 1, text: "hey"}
                ],
                {$update: {2: {text: "whats up"}}, ids: [2, 1]}
            ]
        }
    },
    objects: {
        "throws an invalid type": () => {
            expect(() => makeDiff("whoa", {})).toThrow();
        },
        "set nested": [
            {whoa: {hey: {stuff: 1, test: "blegh"}}},
            {whoa: {hey: {stuff: 2, test: "blegh"}}},
            {whoa: {hey: {stuff: 2}}},
        ],
        "add property": [
            {unchanged: "hey"},
            {unchanged: "hey", added: 123},
            {added: 123}
        ],
        "remove property": [
            {unchanged: "hey", toRemove:123},
            {unchanged: "hey"},
            {toRemove: {$remove: true}}
        ],
        // "custom test": [
        //     {id: 2, text: "whats"},
        //     {id: 2, text: "whats up"},
        //     {text: "whats up"}
        // ]
    }
});

function runDiffTests(tests) {
    _.forOwn(tests, (test, key) => {
        if (_.isFunction(test)) {
            it(key, test);
        } else if (_.isArray(test)) {
            const [before, after, diff] = test;
            const result = makeDiff(before, after);

            describe(`(${key})`, () => {
                it("diff", () => {
                    expect(result).toEqual(diff);
                });

                if(result != IS_UNCHANGED) {
                    it("merge", () => {
                        const mergedBack = mergeDiff(before, result);
                        expect(mergedBack).toEqual(after);
                    })
                }
            });
        } else if (_.isObject(test)) {
            describe(`${key}: `, () => runDiffTests(test));
        }
    });
}

