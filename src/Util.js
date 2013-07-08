var Util = {};

Util.find = function (arr, predicate) {
	for (var i = 0; i < arr.length; i++) {
		if (predicate(i, arr[i])) {
			return arr[i];
		}
	}

	return undefined;
};

Util.each = function (arr, iterator) {
	for (var i = 0; i < arr.length; i++) {
		iterator(i, arr[i]);
	}
};

Util.any = function (arr, predicate) {
	for (var i = 0; i < arr.length; i++) {
		if (predicate(i, arr[i])) {
			return true;
		}
	}

	return false;
};

Util.arraysEqual = function (arr1, arr2) {
	var i;

	if (arr1.length !== arr2.length) {
		return false;
	}

	for (i = 0; i < arr1.length; i++) {
		if (arr1[i].id !== undefined && arr2[i].id !== undefined && arr1[i].id === arr2[i].id) {
			continue;
		}

		if(arr1[i] === arr2[i]) {
			continue;
		}

		return false;
	}

	return true;
};

Util.arraySubtract = function (arr1, arr2) {
	var slate = [],
		foundMatch,
		each = Util.each,
		any = Util.any,
		type = Util.getType;

	each(arr1, function (i, val1) {
		foundMatch = any(arr2, function (j, val2) {
			return (type(val2) === "Object" && val2.id === val1.id) ||
				(val2 === val1);
		});

		if (!foundMatch) {
			slate.push(val1);
		}
	});

	return slate;
};

Util.getType = function (o) {
	return !!o && Object.prototype.toString.call(o).match(/(\w+)\]/)[1];
};

Util.clone = function (o) {
	return JSON.parse(JSON.stringify(o));
};

Util.isEmpty = function (o) {
	for (var prop in o) {
		if(o.hasOwnProperty(prop)) {
			return false;
		}
	}

	return true;
};
