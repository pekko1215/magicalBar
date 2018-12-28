/**
 * Created by pekko1215 on 2017/07/15.
 */

var lines = {
    "上段":[
        [1,1,1],
        [0,0,0],
        [0,0,0]
    ],
    "下段":[
        [0,0,0],
        [0,0,0],
        [1,1,1]
    ],
    "右上がり":[
        [0,0,1],
        [0,1,0],
        [1,0,0]
    ],
    "右下がり":[
        [1,0,0],
        [0,1,0],
        [0,0,1]
    ]
}

var YakuData = [{
        name: "はずれ",
        pay: [0, 0, 0]
    },
    {
        name: "リプレイ",
        pay: [0, 0, 0]
    },
    {
        name: "ベル",
        pay: [8, 8, 8]
    },
    {
        name: "チェリー",
        pay: [4, 0, 0]
    },
    {
        name: "上段鏡",
        pay: [1, 0, 0],
        show:lines['上段'],
        noflash:true
    },
    {
        name: "中段鏡",
        pay: [1, 0, 0],
        noflash:true
    },
    {
        name: "右下がりBIG1",
        pay: [0, 0, 0],
        show:lines['右下がり']
    },
    {
        name: "中段BIG1",
        pay: [0, 0, 0]
    },
    {
        name: "下段BIG2",
        pay: [0, 0, 0],
        show:lines['下段']
    },
    {
        name: "JAC15",
        pay: [0, 0, 15]
    },
    {
        name: "JACIN1",
        pay: [0, 0, 0]
    },
    {
        name: 'ベル',
        pay: [8, 8, 8],
        show:lines['右下がり']
    },
    {
        name: 'ベル',
        pay: [8, 8, 8],
        show:lines['上段']
    },
    {
        name: 'リプレイ',
        pay: [0, 0, 0],
        show:lines['右上がり']
    },
    {
        name: 'リプレイ',
        pay: [0, 0, 0],
        show:lines['下段']
    },
    {
        name: '鏡15枚',
        pay: [15, 15, 0],
        show:lines['右下がり'],
        noflash:true
    },
    {
        name: '鏡JACIN',
        pay: [0, 0, 0],
        show:lines['右上がり'],
        noflash:true
    },
    {
        name: '鏡JACIN',
        pay: [0, 0, 0],
        show:lines['下段'],
        noflash:true
    },
    {
        name: 'JACIN2',
        pay: [0, 0, 0],
        noflash:true
    },
    {
        name: '1枚役',
        pay: [1, 1, 1],
        noflash:true
    },
    {
        name: '1枚役',
        pay: [1, 1, 0],
        noflash:true
    },
    {
        name:'チェリー',
        pay:[4,4,4],
        show:lines['右上がり']
    },
    {
        name:'チェリー',
        pay:[4,4,4],
        show:lines['右下がり']
    },
    {
        name: "上段JACIN",
        pay: [0, 0, 0],
        show:lines['上段']
    },
    {
        name: "右上がりJACIN",
        pay: [0, 0, 0],
        show:lines['右上がり']
    },
]