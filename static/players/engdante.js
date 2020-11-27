const onGameMessage = (typeof importScripts === 'function'
	? (importScripts('port.js'), self)
	: require('./port')
).port;


let captain = [0,0,12]; // speed, rudder, fireSector
const zeroarray = [0,0,0];
const rangeClose = 80;
const rangeFar = 125;
const rangeAway = 150;
var collisionTimer = 0;
var moral = 1;

const movenormal = [0,-2,-1, 0, 1, 2, 3,-3,-2, 0, 1, 2, 3]
//                  0  1  2  3  4  5  6  7  8  9 10 11 12
const movefar    = [0, 1, 2, 3, 3, 3, 3, 3,-3,-3,-2,-1,-1]
//                  0  1  2  3  4  5  6  7  8  9 10 11 12
const moveclose  = [0,-3,-3,-3,-2,-2, 0, 2, 2, 3, 3, 3, 3]
//                  0  1  2  3  4  5  6  7  8  9 10 11 12
const moveHMoral = [0, 1, 2, 3, 3, 3, 3, 3,-3,-3,-2,-1,-1]
//                  0  1  2  3  4  5  6  7  8  9 10 11 12
const moveLMoral = [0,-3,-3,-3,-2,-2, 0, 2, 2, 3, 3, 3, 3]
//                  0  1  2  3  4  5  6  7  8  9 10 11 12
const collision  = [0,-3,-3,-2, 0, 0, 0, 0, 0, 2, 3, 3, 3]
//                  0  1  2  3  4  5  6  7  8  9 10 11 12

onGameMessage(({ ownShip, targets }) => {
	captain = zeroarray;
	if (ownShip.score + targets[0].score > 30) {
		moral = ownShip.score / targets[0].score;
	}
	captain = moving(ownShip, targets, captain);
	captain[2] = targets[0].bearingSector;

	speed = captain[0];
	rudder = captain[1];
	fireSector = captain[2];
	// console.log(captain[0], captain[1], captain[2], moral);
	return {
		speed, rudder, fireSector,
	};
});

function moving(ship, ships, arr) {
	if (moral > 0.75 & moral < 1.25) {
		console.log('Normal Moral', captain[0], captain[1], captain[2], moral);
		if (ships[0].range < rangeAway & ships[0].range > rangeClose) {
			arr[1] = movenormal[ships[0].bearingSector];
			arr[0] = 4;
		}
		if (ships[0].range <= rangeClose) {
			arr[1] = moveclose[ships[0].bearingSector];
			arr[0] = 6;
		}
		if (ships[0].range >= rangeAway) {
			arr[1] = movefar[ships[0].bearingSector];
			arr[0] = 6;
		}
	}
	if (moral <= 0.90) {
		console.log('Low Moral', captain[0], captain[1], captain[2], moral);
		if (ships[0].range < rangeFar) {
			arr[1] = moveLMoral[ships[0].bearingSector];
			arr[0] = 6;
		}
		if (ships[0].range >= rangeFar) {
			arr[1] = moveLMoral[ships[0].bearingSector];
			arr[0] = 0;
		}
	}
	if (moral >= 1.25) {
		console.log('High morale', captain[0], captain[1], captain[2], moral);
		arr[1] = moveHMoral[ships[0].bearingSector];
		arr[0] = 6;
	}
	if (ship.blockedSector > 0) {
		arr[1] = collision[ship.blockedSector];
		arr[0] = 6;
	}
	return arr;
}