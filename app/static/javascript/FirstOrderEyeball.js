/**
 * Created by EduanOosthuizen on 21/02/2016.
 */

// Variables
var inds = cb_obj.get('selected')['1d'].indices;
var d = cb_obj.get('data');
var KFit = 0;
var tauFit = 0;
var arrFit_x = [];
var arrFit_y = [];
var xspan = 0;
var y_tau = 0;
var yspan = 0;
var nValues = 100;
var xmax = [];
var xmin = [];
var ymax = [];
var ymin = [];
var data_inds = [];
var condi = true;
var count = 0;
var xselect = [];
var yselect = [];


// Functions
function dataAndIndsSort(arrx, arry, arrinds) {
    var tmp = 0;
    var rx, ry, ri = [];

    rx = arrx;
    ry = arry;
    ri = arrinds;

    for (var ii=0; ii<arrinds.length; ii++) {
        for (var jj=0; jj<arrinds.length-ii-1; jj++) {
            if (rx[jj]>rx[jj+1]) {
                tmp = rx[jj];
                rx[jj] = rx[jj+1];
                rx[jj + 1] = tmp;
                tmp = ry[jj];
                ry[jj] = ry[jj+1];
                ry[jj+1] = tmp;
                tmp = ri[jj];
                ri[jj] = ri[jj+1];
                ri[jj+1] = tmp;
            }
        }
    }
    return [rx, ry, ri]  // This is a multi-dimensional array
}

function arrayMin(arr, inds) {
    var len = inds.length;
    var min = Infinity;
    var index = Infinity;

    for (var ii = 0; ii < len; ii++) {
        if (arr[inds[ii]] < min) {
            min = arr[inds[ii]];
            index = ii;
         }
    }  // In JS arr.length snd and array indexing is similar to Python
    return [min, index];
}

function arrayMax(arr, inds) {
    var len = inds.length;
    var max = -Infinity;
    var index = Infinity;

    for (var ii = 0; ii< len; ii++) {
        if (arr[inds[ii]] > max) {
            max = arr[inds[ii]];
            index = ii;
        }
    }
    return [max, index];
}

function firstOrderResponse(arrX, tau, K) {
    var arrY = [];
    for (var ii = 0; ii < arrX.length; ii++) {
        arrY.push(K*1.0*(1 - Math.exp(-arrX[ii]/tau)))
    }
    return arrY;
}

// Script Code
if (inds.length == 0) { return; }  // No selection sets no action

/**
for (var ii = 0; ii < d['color'].length; ii++) {
    d['color'][i] = 'navy';  // RESET of colour for circle glyphs to allow multiple selections.
}

for (var ii = 0; ii < inds.length; ii++) {
    d['color'][inds[ii]] = 'green';  // FEEDBACK by showing selection after box select tool disappears
}
**/
xmax = arrayMax(d['x'], inds);
xmin = arrayMin(d['x'], inds);
ymax = arrayMax(d['y'], inds);
ymin = arrayMin(d['y'], inds);

xspan = xmax[0] - xmin[0];
yspan = ymax[0] - ymin[0];

KFit = yspan/1.;  // Here M (size of disturbance) is assumed 1 for time being.
y_tau = 0.632 * KFit;

for (var ii = 0; ii < inds.length; ii++) {
    xselect.push(d['x'][inds[ii]]);
    yselect.push(d['y'][inds[ii]]);
}

data_inds = dataAndIndsSort(xselect, yselect, inds);

console.log(data_inds)
condi = true;
count = inds.length - 1;
while (condi && (count >= 0)) {
    if (y_tau + ymin[0] > data_inds[1][count]) {
        tauFit = (((data_inds[0][count] - data_inds[0][count+1])/(data_inds[1][count] - data_inds[1][count+1]))
            *(y_tau - data_inds[1][count])) + data_inds[0][count];
        console.log(data_inds[1][count], y_tau, data_inds[1][count-1]);
        condi = false;
    }
    count -= 1;
}

for (var ii = 0; ii <= nValues; ii++) {
    arrFit_x.push((ii/nValues)*xspan);
}

arrFit_y = firstOrderResponse(arrFit_x, tauFit, KFit);

for (var ii = 0; ii < arrFit_x.length; ii++) {
    arrFit_x[ii] = arrFit_x[ii] + d['x'][inds[0]];
    arrFit_y[ii] = arrFit_y[ii] + d['y'][inds[0]];
}

sourceFit.get('data')['xfit'] = arrFit_x;
sourceFit.get('data')['yfit'] = arrFit_y;

cb_obj.trigger('change');
sourceFit.trigger('change');