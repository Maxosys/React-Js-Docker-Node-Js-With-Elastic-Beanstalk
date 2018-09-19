var s = c.width = c.height = 390,
		ctx = c.getContext( '2d' ),
		
		opts = {
			globeRadius: 100,
			depth: 200,
			focalLength: 200,
			center: s / 2,
			
			rotYVel: .01,
			baseXRot: -0.41, // 23.5 deg
			afterYRot: -2,//Math.PI / 2,
		},
		
		rot = {
			y: {
				cos: Math.cos( opts.rotYVel ),
				sin: Math.sin( opts.rotYVel )
			},
			z: {
				cos: Math.cos( opts.baseXRot ),
				sin: Math.sin( opts.baseXRot )
			},
			ay: {
				cos: Math.cos( opts.afterYRot ),
				sin: Math.sin( opts.afterYRot )
			}
		};

function anim(){
		
	window.requestAnimationFrame( anim );
	
	ctx.fillStyle = '#030C26';
	ctx.fillRect( 0, 0, s, s );
	ctx.rect(255, 255, 255, 100);
	ctx.strokeStyle = '#fff';
ctx.shadowBlur = 15;
ctx.shadowOffsetX = 3;
ctx.shadowOffsetY = 3;
ctx.shadowColor = "white";

	ctx.beginPath();
	
	for( var i = 0; i < lines.length; ++i ){
		
		var points = lines[ i ];
		
		for( var j = 0; j < points.length; ++j ){
			
			var point = points[ j ],
					x = point.x,
					y = point.y,
					z = point.z;
			
			var X = x;
			x = x * rot.y.cos - z * rot.y.sin;
			z = z * rot.y.cos + X * rot.y.sin;
			
			point.x = x;
			point.z = z;
			
			var Y = y;
			y = y * rot.z.cos - x * rot.z.sin;
			x = x * rot.z.cos + Y * rot.z.sin;
			
			X = x;
			x = x * rot.ay.cos - z * rot.ay.sin;
			z = z * rot.ay.cos + X * rot.ay.sin;
			
			z += opts.depth;
			
			var scale = opts.focalLength / z,
					sx = opts.center + scale * x,
					sy = opts.center + scale * y;
			
			point.sx = sx;
			point.sy = sy;
			
			//if( z < opts.depth )
				ctx[ j === 0 ? 'moveTo' : 'lineTo' ]( sx, sy );
		}
					
		// to prevent it from recalculating position of starting point twice but still closing the path
		//if( points[ 0 ].z < opts.depth ) 
			ctx.lineTo( points[ 0 ].sx, points[ 0 ].sy );
	}
	
	ctx.stroke();
	
	//ctx.fillStyle = 'green';
	//ctx.fill();
	
};
function reparseLines(){
	
	// the lines will just have indications for angles
	
	for( var i = 0; i < lines.length; ++i ){
		
		var points = [];
		for( var j = 0; j < lines[ i ].length; j += 2 ){
			
			var sinA = Math.sin( lines[ i ][ j ] * Math.PI ),
					cosA = Math.cos( lines[ i ][ j ] * Math.PI ),
					sinB = Math.sin( lines[ i ][ j + 1 ] * Math.PI / 2 ),
					cosB = Math.cos( lines[ i ][ j + 1 ] * Math.PI / 2 );
			
			points.push({
				x: opts.globeRadius * cosA * cosB,
				y: opts.globeRadius * sinB,
				z: opts.globeRadius * sinA * cosB
			});
		}
		
		lines[ i ] = points;
	}
}

// each point is 2 angles in half turns
// a, x[-1,1] = vertical circle
// x[-1,1], .5 = equator
// x[-1,1], a = parallel cirles at a
var lines = [
	// africa main continent
	[
		-.04, -.05,
		.01, -.05,
		.02, -.07,
		.06, -.03,
		.05, .03,
		.08, .12,
		.06, .18,
		.08, .25,
		.10, .35,
		.10, .39,
		.15, .37,
		.18, .33,
		.17, .28,
		.19, .28,
		.19, .23,
		.22, .19,
		.22, .06,
		.27, -.033,
		.29, -.15,
		.23, -.13,
		.175, -.33,
		.12, -.36,
		.1, -.32,
		.06, -.36,
		.06, -.405,
		.01, -.39,
		-.03, -.38,
		-.05, -.35,
		-.08, -.28,
		-.08, -.205,
		-.088, -.15,
	],
	// madagascar
	[0.245, 0.192, 0.245, 0.233, 0.241, 0.267, 0.249, 0.3, 0.266, 0.275, 0.287, 0.175, 0.274, 0.142],
	// antarctica
	[-0.984, 0.892, -0.918, 0.875, -0.748, 0.825, -0.662, 0.817, -0.559, 0.842, -0.559, 0.792, -0.46, 0.825, -0.402, 0.825, -0.414, 0.775, -0.311, 0.692, -0.328, 0.75, -0.324, 0.808, -0.34, 0.825, -0.233, 0.883, -0.023, 0.783, 0.196, 0.783, 0.237, 0.75, 0.254, 0.758, 0.287, 0.725, 0.414, 0.767, 0.464, 0.733, 0.48, 0.733, 0.489, 0.783, 0.505, 0.717, 0.551, 0.725, 0.6, 0.742, 0.625, 0.717, 0.645, 0.758, 0.72, 0.758, 0.79, 0.742, 0.934, 0.783, 0.909, 0.833, 0.922, 0.867],
	// south america
	[-0.427, -0.067, -0.39, -0.142, -0.373, -0.108, -0.373, -0.083, -0.332, -0.125, -0.291, -0.067, -0.282, -0.008, -0.188, 0.075, -0.192, 0.108, -0.212, 0.133, -0.208, 0.217, -0.229, 0.258, -0.254, 0.258, -0.262, 0.283, -0.262, 0.333, -0.287, 0.383, -0.303, 0.383, -0.303, 0.425, -0.336, 0.433, -0.348, 0.458, -0.344, 0.475, -0.369, 0.5, -0.361, 0.525, -0.373, 0.55, -0.357, 0.6, -0.394, 0.6, -0.402, 0.542, -0.394, 0.492, -0.41, 0.433, -0.394, 0.392, -0.406, 0.35, -0.39, 0.308, -0.39, 0.25, -0.381, 0.225, -0.419, 0.15, -0.419, 0.1, -0.456, 0.058, -0.435, 0.025, -0.435, -0.008, -0.427, -0.008, -0.427, -0.058],
	// that south american island in the south
	[-0.336, 0.575, -0.307, 0.575, -0.311, 0.6, -0.328, 0.6],
	// north 'murica
	[-0.435, -0.067, -0.456, -0.075, -0.493, -0.15, -0.505, -0.15, -0.526, -0.192, -0.571, -0.192, -0.629, -0.358, -0.604, -0.258, -0.641, -0.308, -0.641, -0.333, -0.687, -0.45, -0.674, -0.533, -0.707, -0.6, -0.72, -0.575, -0.736, -0.617, -0.814, -0.692, -0.847, -0.625, -0.889, -0.608, -0.893, -0.658, -0.905, -0.675, -0.905, -0.717, -0.88, -0.733, -0.909, -0.742, -0.946, -0.742, -0.975, -0.775, -0.955, -0.792, -0.926, -0.758, -0.893, -0.792, -0.703, -0.792, -0.654, -0.808, -0.621, -0.75, -0.522, -0.758, -0.497, -0.792, -0.456, -0.775, -0.39, -0.725, -0.472, -0.75, -0.431, -0.708, -0.476, -0.708, -0.513, -0.667, -0.456, -0.625, -0.435, -0.55, -0.435, -0.617, -0.414, -0.617, -0.435, -0.7, -0.406, -0.7, -0.377, -0.642, -0.353, -0.675, -0.307, -0.592, -0.307, -0.558, -0.373, -0.567, -0.291, -0.55, -0.282, -0.525, -0.344, -0.492, -0.353, -0.517, -0.402, -0.45, -0.419, -0.392, -0.435, -0.35, -0.427, -0.275, -0.447, -0.283, -0.472, -0.333, -0.48, -0.325, -0.526, -0.325, -0.53, -0.233, -0.493, -0.2, -0.485, -0.225, -0.468, -0.225, -0.48, -0.2, -0.468, -0.167, -0.452, -0.167, -0.452, -0.108],
		// cuba
		[-0.464, -0.242, -0.443, -0.25, -0.41, -0.233, -0.414, -0.2, -0.435, -0.242],
		// greenland
		[-0.373, -0.883, -0.365, -0.833, -0.32, -0.85, -0.282, -0.783, -0.295, -0.758, -0.262, -0.667, -0.229, -0.667, -0.229, -0.708, -0.208, -0.742, -0.163, -0.767, -0.113, -0.8, -0.105, -0.825, -0.093, -0.883, -0.064, -0.917, -0.13, -0.917, -0.204, -0.942, -0.282, -0.917, -0.353, -0.917],
		// iceland
		[-0.134, -0.742, -0.093, -0.733, -0.08, -0.7, -0.089, -0.683, -0.118, -0.683, -0.13, -0.708],
		// eurasia
		[-0.006, -0.492, -0.043, -0.475, -0.047, -0.408, -0.035, -0.408, -0.023, -0.4, -0.006, -0.425, 0.014, -0.458, 0.014, -0.475, 0.052, -0.483, 0.072, -0.458, 0.093, -0.442, 0.093, -0.417, 0.101, -0.425, 0.105, -0.425, 0.085, -0.467, 0.072, -0.492, 0.072, -0.5, 0.08, -0.5, 0.113, -0.458, 0.113, -0.442, 0.126, -0.4, 0.134, -0.433, 0.134, -0.45, 0.155, -0.45, 0.159, -0.4, 0.171, -0.4, 0.184, -0.417, 0.188, -0.375, 0.2, -0.408, 0.204, -0.4, 0.2, -0.367, 0.188, -0.342, 0.221, -0.225, 0.241, -0.183, 0.237, -0.15, 0.266, -0.158, 0.311, -0.2, 0.332, -0.242, 0.311, -0.275, 0.299, -0.258, 0.278, -0.308, 0.278, -0.325, 0.299, -0.292, 0.32, -0.292, 0.324, -0.275, 0.369, -0.283, 0.39, -0.225, 0.41, -0.25, 0.41, -0.2, 0.427, -0.083, 0.443, -0.117, 0.443, -0.167, 0.48, -0.225, 0.505, -0.242, 0.526, -0.15, 0.538, -0.175, 0.542, -0.108, 0.567, -0.15, 0.592, -0.1, 0.608, -0.117, 0.608, -0.175, 0.584, -0.192, 0.596, -0.233, 0.604, -0.192, 0.621, -0.233, 0.654, -0.267, 0.678, -0.342, 0.666, -0.392, 0.678, -0.442, 0.695, -0.4, 0.724, -0.425, 0.711, -0.442, 0.724, -0.475, 0.748, -0.475, 0.773, -0.542, 0.753, -0.617, 0.781, -0.65, 0.847, -0.667, 0.864, -0.692, 0.885, -0.692, 0.864, -0.633, 0.864, -0.55, 0.897, -0.608, 0.901, -0.65, 0.897, -0.683, 0.951, -0.683, 0.984, -0.708, 0.975, -0.733, 0.988, -0.783, 0.897, -0.783, 0.885, -0.783, 0.827, -0.783, 0.794, -0.817, 0.753, -0.792, 0.728, -0.8, 0.707, -0.825, 0.67, -0.8, 0.592, -0.792, 0.633, -0.85, 0.592, -0.85, 0.534, -0.917, 0.509, -0.883, 0.551, -0.867, 0.464, -0.833, 0.439, -0.817, 0.406, -0.8, 0.369, -0.783, 0.398, -0.792, 0.402, -0.75, 0.39, -0.75, 0.332, -0.783, 0.32, -0.8, 0.39, -0.858, 0.315, -0.867, 0.291, -0.808, 0.328, -0.775, 0.266, -0.75, 0.237, -0.733, 0.208, -0.692, 0.188, -0.733, 0.221, -0.733, 0.212, -0.767, 0.192, -0.767, 0.151, -0.808, 0.093, -0.767, 0.068, -0.708, 0.035, -0.708, 0.035, -0.65, 0.06, -0.65, 0.072, -0.633, 0.093, -0.633, 0.105, -0.692, 0.134, -0.725, 0.122, -0.683, 0.159, -0.675, 0.126, -0.65, 0.109, -0.583, 0.064, -0.6, 0.064, -0.642, 0.047, -0.642, 0.052, -0.6, 0.023, -0.567, -0.019, -0.567],
	// japan
	[0.72, -0.383, 0.769, -0.408, 0.777, -0.467, 0.786, -0.517, 0.777, -0.567, 0.798, -0.583, 0.786, -0.542, 0.81, -0.458, 0.786, -0.458, 0.786, -0.408, 0.748, -0.358, 0.736, -0.358, 0.724, -0.325],
	// ailarts'
	[0.781, 0.2, 0.753, 0.183, 0.757, 0.142, 0.736, 0.142, 0.715, 0.183, 0.707, 0.158, 0.687, 0.2, 0.637, 0.25, 0.625, 0.308, 0.641, 0.35, 0.637, 0.4, 0.67, 0.383, 0.687, 0.375, 0.728, 0.342, 0.753, 0.392, 0.765, 0.367, 0.777, 0.417, 0.806, 0.425, 0.827, 0.425, 0.847, 0.317, 0.806, 0.2, 0.802, 0.158, 0.786, 0.133],
	// philippines, papua new guinea and other islands
	[0.555, -0.075, 0.571, -0.05, 0.571, 0, 0.596, 0.025, 0.596, 0.058, 0.645, 0.092, 0.703, 0.092, 0.592, 0.092, 0.555, 0.025, 0.555, -0.008, 0.53, -0.05, 0.559, -0.033],
	[0.649, -0.067, 0.654, -0.033, 0.662, -0.017, 0.645, 0.05, 0.625, 0.033, 0.604, -0.008, 0.645, -0.067],
	[0.67, -0.2, 0.658, -0.175, 0.666, -0.125, 0.649, -0.083, 0.678, -0.117, 0.678, -0.083, 0.695, -0.05, 0.695, -0.117, 0.678, -0.158],
	[0.695, 0.05, 0.724, 0.042, 0.753, 0.05, 0.761, 0.092, 0.781, 0.092, 0.81, 0.092, 0.831, 0.125, 0.814, 0.083, 0.843, 0.025, 0.81, 0.058, 0.773, 0.025, 0.748, 0.042],
	[0.81, 0.467, 0.802, 0.483, 0.814, 0.517, 0.827, 0.475],
	[0.951, 0.4, 0.963, 0.45, 0.922, 0.5, 0.942, 0.533, 0.942, 0.5, 0.959, 0.492, 0.979, 0.433],
	[0.909, 0.242, 0.926, 0.267],
	[0.975, 0.192, 0.992, 0.208],
	[0.06, -0.875, 0.101, -0.842, 0.134, -0.842, 0.155, -0.9],
	// "great" britain
	[-0.019, -0.65, 0.002, -0.608, -0.014, -0.608, -0.039, -0.633],
	[-0.043, -0.583, -0.043, -0.575, -0.023, -0.567],
	// isle of the easter heads
	[-0.86, -0.208, -0.847, -0.183]
];

// debugging purposes
/* var deCanvas = document.createElement( 'canvas' ),
		deCtx = deCanvas.getContext( '2d' ),

		deW = deCanvas.width = 485,
		deH = deCanvas.height = 240;

deCanvas.className =  'debug-canvas';

document.body.appendChild( deCanvas );

deCtx.strokeStyle = 'green';
deCtx.lineWidth = 3;
deCtx.beginPath();

for( var i = 0; i < lines.length; ++i ){
	
	for( var j = 0; j < lines[ i ].length; j += 2 ){
		
		var x = deW / 2 * ( 1 + lines[ i ][ j ] ),
				y = deH / 2 * ( 1 + lines[ i ][ j + 1 ] );
		
		deCtx[ j === 0 ? 'moveTo' : 'lineTo' ]( x, y );
	}
	
	var x = deW / 2 * ( 1 + lines[ i ][ 0 ] ),
		  y = deH / 2 * ( 1 + lines[ i ][ 1 ] );
	
	//deCtx.lineTo( x, y );
}

deCtx.stroke();

var clicks = []

deCanvas.addEventListener( 'click', function( e ){
	var rect = deCanvas.getBoundingClientRect();
	
	clicks.push( parseFloat( ( ( e.clientX - rect.left ) / deW * 2 - 1 ).toFixed(3) ), parseFloat( ( ( e.clientY - rect.top ) / deH * 2 - 1 ).toFixed(3) ) );
	
	console.clear();
	console.log( clicks );
}) */

reparseLines();
anim();