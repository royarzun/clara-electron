var ipc = require('electron').ipcRenderer;


var h1f_json = {
    "count": 10000933,
    "mean": 20434.64165403368,
    "std_dev": 11660.874609648426,
    "counts": [122703, 428974, 338243, 266783, 234181, 201244, 150779, 132727, 121575, 108444, 103793, 99558, 97269, 95702, 95483, 95931, 97178, 98285, 100915, 103734, 105390, 108291, 111636, 114062, 114114, 114627, 115944, 118253, 122255, 127421, 132567, 134880, 139415, 142030, 144486, 147031, 148600, 151521, 154696, 158386, 163972, 169576, 177619, 183445, 185998, 189991, 193090, 195689, 209273, 242143, 257463, 254864, 245612, 238838, 234262, 249409, 255780, 233539, 151790, 78621, 46995, 31208, 23018, 17942, 14159, 11268, 8940, 6878, 5459, 4346, 3445, 2780, 2285, 1975, 1631, 1257, 1106, 889, 765, 684, 604, 454, 386, 337, 295, 245, 231, 188, 172, 141, 119, 123, 120, 95, 79, 68, 53, 49, 39, 25],
    "errors": [350.2898799565868, 654.9610675452396, 581.5866229548269, 516.5104064779334, 483.9225144586683, 448.60227373476386, 388.30271696190846, 364.31716951030455, 348.67606743222285, 329.30836612512593, 322.169210198616, 315.52812869853614, 311.87978453243807, 309.3573984891908, 309.0032362290078, 309.72729941030383, 311.7338608492828, 313.5043859342322, 317.6712136785453, 322.0776303936677, 324.63826022205086, 329.0759790686643, 334.11973901582047, 337.730661918636, 337.80763756907567, 338.5660939905235, 340.50550656340346, 343.8793393037738, 349.6498248247809, 356.9607821596092, 364.0975144106315, 367.26012579641696, 373.38318119593976, 376.8686773930675, 380.1131410514506, 383.44621526362727, 385.4867053479277, 389.2569845230783, 393.31412382471086, 397.9773862922365, 404.93456261475137, 411.79606603269053, 421.44869201363053, 428.3047980118831, 431.2748543562446, 435.87957052378584, 439.42007236811565, 442.36749428501184, 457.4636597588928, 492.0802780034981, 507.40811976159785, 504.8405688927941, 495.5925746013554, 488.7105482798586, 484.0061983074184, 499.40865030553886, 505.74697230927643, 483.25872987458797, 389.60236138914763, 280.3943651359635, 216.78330193997877, 176.6578614157887, 151.71684151734772, 133.94775100762237, 118.9915963419266, 106.15083607772479, 94.55157322858251, 82.93370846646133, 73.8850458482635, 65.92419889539804, 58.69412236331676, 52.72570530585627, 47.80167361086848, 44.44097208657794, 40.38564101261734, 35.45419580247167, 33.25657829663178, 29.816103031751148, 27.65863337187866, 26.153393661244042, 24.576411454889016, 21.307275752662516, 19.6468827043885, 18.35755975068582, 17.175564037317667, 15.652475842498529, 15.198684153570664, 13.711309200802088, 13.114877048604, 11.874342087037917, 10.908712114635714, 11.090536506409418, 10.954451150103322, 9.746794344808963, 8.888194417315589, 8.246211251235321, 7.280109889280518, 7.0, 6.244997998398398, 5.0],
    "means": [1422.0119719979648, 1853.3748525551102, 2440.8665013022, 3054.2394980189943, 3656.4255042040536, 4257.144322315234, 4866.706557279188, 5476.662841772971, 6079.568891630664, 6688.294677437197, 7294.120605435823, 7898.778259908794, 8503.68849273664, 9108.706589203986, 9715.517631410825, 10319.565010267796, 10926.822428944819, 11531.25682454088, 12135.198939701728, 12739.678360036249, 13344.468839548346, 13950.937944981577, 14553.69181984306, 15160.368229559355, 15763.176902045325, 16367.921772357293, 16974.529471124, 17580.737714899402, 18185.14335609994, 18789.94515817645, 19393.218055775564, 19998.65388493476, 20603.13112649284, 21207.717447018233, 21812.513087773208, 22417.398671028564, 23022.37222745626, 23626.889579662227, 24232.12246599783, 24837.682339348175, 25443.654770326648, 26047.42523706184, 26651.78179699244, 27256.457041620106, 27861.052957558688, 28466.226958119067, 29069.58483090787, 29675.69374875441, 30285.318316266395, 30890.637429122493, 31492.783324205786, 32090.38559780901, 32693.045922023375, 33303.13531766301, 33914.98252384084, 34500.07265976773, 35138.5226014545, 35709.28513867062, 36296.11811054751, 36902.38329453967, 37514.31150122354, 38125.20177518586, 38733.180467460246, 39339.13499052502, 39944.897026626175, 40547.55910543131, 41149.89082774049, 41762.041000290796, 42365.661659644626, 42968.27910722503, 43571.49346879536, 44181.79316546762, 44787.480087527365, 45385.311898734166, 45994.33599019007, 46598.608591885444, 47205.19981916817, 47816.718785151854, 48412.10849673203, 49025.37573099415, 49626.03973509934, 50232.850220264314, 50834.29792746114, 51437.24035608307, 52062.04406779661, 52653.97551020408, 53239.88744588745, 53859.696808510635, 54450.01162790698, 55071.936170212764, 55665.94957983193, 56298.14634146341, 56886.441666666666, 57470.31578947368, 58091.784810126584, 58690.01470588235, 59307.75471698113, 59908.4081632653, 60509.02564102564, 61074.24],
    "annotation": {
        "Title": "Reflectance_I1_Avg",
        "AidaPath": "/1D Histogram/Reflectance_I1_Avg",
        "FullPath": "/Analysis Results for Copy Of MODIS-VIIRS-IC-2015/1D Histogram/Reflectance_I1_Avg",
        "xAxisLabel": "Reflectance_I1_Avg"
    },
    "xAxis": {
        "binWidth": 604.83,
        "centers": [1247.415, 1852.245, 2457.075, 3061.905, 3666.735, 4271.5650000000005, 4876.395, 5481.225, 6086.055, 6690.885, 7295.715, 7900.545, 8505.375000000002, 9110.205000000002, 9715.035000000002, 10319.865000000002, 10924.695000000002, 11529.525000000001, 12134.355000000001, 12739.185000000001, 13344.015000000001, 13948.845000000001, 14553.675000000001, 15158.505000000001, 15763.335000000003, 16368.165000000003, 16972.995000000003, 17577.825, 18182.655000000002, 18787.485, 19392.315000000002, 19997.145, 20601.975000000002, 21206.805000000004, 21811.635000000002, 22416.465000000004, 23021.295000000002, 23626.125000000004, 24230.955, 24835.785000000003, 25440.615, 26045.445000000003, 26650.275, 27255.105000000003, 27859.935, 28464.765000000003, 29069.595, 29674.425000000003, 30279.255000000005, 30884.085000000003, 31488.915000000005, 32093.745000000003, 32698.575000000004, 33303.405, 33908.235, 34513.065, 35117.895000000004, 35722.725000000006, 36327.555, 36932.385, 37537.215000000004, 38142.045000000006, 38746.875, 39351.705, 39956.535, 40561.365000000005, 41166.19500000001, 41771.025, 42375.855, 42980.685000000005, 43585.51500000001, 44190.345, 44795.175, 45400.005000000005, 46004.83500000001, 46609.665, 47214.495, 47819.325000000004, 48424.155000000006, 49028.985, 49633.815, 50238.645000000004, 50843.475000000006, 51448.30500000001, 52053.135, 52657.965000000004, 53262.795000000006, 53867.62500000001, 54472.455, 55077.285, 55682.115000000005, 56286.94500000001, 56891.775, 57496.605, 58101.435000000005, 58706.26500000001, 59311.09500000001, 59915.925, 60520.755000000005, 61125.58500000001]
    }
};

process.on('message', function(args) {
  process.send(h1f_json);
});