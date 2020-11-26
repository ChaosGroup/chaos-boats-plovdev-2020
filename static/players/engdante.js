const onGameMessage = (typeof importScripts === 'function'
	? (importScripts('port.js'), self)
	: require('./port')
).port;

var counter = 0;
var oMoral = 1.0;
let captain = [0,0,12]; // speed, rudder, fireSector
const zeroarray = [0,0,0];

onGameMessage(({ ownShip, targets }) => {
	counter =  counter + 1;
	oMoral = moralStatus (ownShip.health, targets[0].health);
	captain = zeroarray;
	captain = collisionCheck(ownShip, captain);
	captain = fire(targets, captain);
	captain = moving(ownShip,targets, captain)
	//console.log(captain[2]);
	// const closestTargets = targets.filter(t => t.range < 90).sort((a, b) => a.range - b.range);
	//const fireSector = closestTargets.length > 0 ? closestTargets[0].bearingSector : 0;
	// const haveTargetInProximity = closestTargets.length > 0 && closestTargets[0].range < 30;

	// 0 -> 6
	// let speed = haveTargetInProximity ? 6 : getRandomIntInclusive(2, 5);

	// -3 <- 0 -> +3
	// let rudder = getRandomIntInclusive(-2, +2);
	// against ship or land
	// if (ownShip.blockedSector) {
	// 	speed = 6; // max speed

	// 	if (ownShip.blockedSector === 12) {
	// 		// in front, pick right or sometimes left
	// 		rudder = 3 * getRandomIntInclusive(1, 10) > 3 ? 1 : -1;
	// 	} else if (ownShip.blockedSector >= 9) {
	// 		// at left, turn right
	// 		rudder = 3;
	// 	} else if (ownShip.blockedSector <= 3) {
	// 		// at right, turn left
	// 		rudder = -3;
	// 	}
	speed = captain[0];
	rudder = captain[1];
	fireSector = captain[2];
	// console.log(targets[0].speed, targets[0].range, targets[0].bowSector);
//}

	return {
		speed,
		rudder,
		fireSector,
	};
});

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function moralStatus(oHelth, tHelth) {
	return oHelth /tHelth;
}

function collisionCheck(ship, arr) {
	// console.log(ship.blockedSector);
	if (ship.blockedSector > 0) {
		console.log(ship.blockedSector);
		arr[1] = 12 - ship.blockedSector;
		arr[0] = 6;
	}
	return arr;
}

function fire(ships, arr) {
	// var k1 = ships[0].speed / 12;
	// var k2 = ships[0].bowSector / 6;
	arr[2] = ships[0].bearingSector;
	// console.log(ships[0].bowSector, arr[2]);
	if (ships[0].range > 115) {
		arr[2] = 0;
	}
	return arr;
}

function moving(ship, ships, arr) {
	if (arr[0] == zeroarray[0]  & arr[1]  == zeroarray[1]) {
		console.log(ship.speed, ships[0].speed);
	}
	return arr;
}

