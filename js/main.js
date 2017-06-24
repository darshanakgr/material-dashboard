var dataSales = {
    labels: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C','C-','D','I-We'],
    series: [[100,150,125,130,125,100,50,25,30,20,5],
        [125,150,100,135,105,110,60,35,30,15,3]
    ]
};

var optionsSales = {
    lineSmooth: false,
    low: 0,
    high: 400,
    showArea: true,
    height: "245px",
    axisX: {
        showGrid: false,
    },
    lineSmooth: Chartist.Interpolation.simple({
        divisor: 3
    }),
    showLine: false,
    showPoint: false,
};

var responsiveSales = [
    ['screen and (max-width: 640px)', {
        axisX: {
            labelInterpolationFnc: function (value) {
                return value[0];
            }
        }
    }]
];

Chartist.Line('#chartHours', dataSales, optionsSales, responsiveSales);

