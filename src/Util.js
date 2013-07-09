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

Util.onlyHasProperties = function (o, properties) {
	var clone = this.clone(o);

	each(properties, function (i, prop) {
		delete clone[prop];
	});

	return this.isEmpty(clone);
};
