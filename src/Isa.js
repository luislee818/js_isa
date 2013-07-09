var Isa,
	find = window.Util.find,
	each = window.Util.each,
	clone = window.Util.clone,
	type = window.Util.getType,
	isEmpty = window.Util.isEmpty,
	onlyHasProperties = window.Util.onlyHasProperties;

// core functions
Isa = function () {};

/**
 * Get an object with all the objects returned by executing fnGuides combined
 *
 * @memberOf Isa
 * @function
 * @param {object} obj The object to incise on
 * @param {array} fnGuides An array of functions
 * @return {object} An object with all the objects returned by executing fnGuides combined
 */
Isa.prototype.incise = function (obj, fnGuides) {
	var slate = {},
		self = this;

	each(fnGuides, function (i, fnGuide) {
		var incisedObj = fnGuide(obj);
		slate = self.add(slate, incisedObj);
	});

	return slate;
};

/**
 * Get shared properties from two objects, "shared" means properties have the same name and hierarchy (property values are not checked)
 *
 * @memberOf Isa
 * @function
 * @param {object} obj1 The first object
 * @param {object} obj2 The second object
 * @return {object} The object with shared properties
 */
Isa.prototype.intersect = function (obj1, obj2) {
	var result = {},
		property;

	if (obj1 === {} || obj2 === {}) {
		return {};
	}

	for (property in obj2) {
		if (obj1.hasOwnProperty(property))
		{
			if (type(obj1[property]) !== "Object") {
				result[property] = obj1[property];
			}
			else {
				result[property] = this.intersect(obj1[property], obj2[property]);
			}
		}
	}

	return result;
};

/**
 * Subtract properties with names in obj2 from obj1, only check property name, property values are not checked
 *
 * @memberOf Isa
 * @function
 * @param {object} obj1 The first object, the object based on which to remove property from
 * @param {object} obj2 The second object, the object based on which to look for properties to remove
 * @return {object} The object with properties subtracted
 */
Isa.prototype.subtract = function (obj1, obj2) {
	var slate,
		property,
		self = this,
		result,
		resultArr;

	if (obj1 === undefined || obj2 === undefined ||
		(type(obj2) === "Object" && isEmpty(obj2))) {
		return obj1;
	}

	if (type(obj1) === "Object") {  // invoke subtract on every property of object
		slate = clone(obj1);

		for (property in obj2) {
			if (property === "id") {
				continue;
			}

			result = self.subtract(obj1[property], obj2[property]);

			if (result === undefined) {
				delete slate[property];
			}
			else {
				slate[property] = result;
			}
		}

		if (isEmpty(slate) ||
			onlyHasProperties(slate, ["id"])) {
			return undefined;
		}
		else {
			return slate;
		}
	}
	else if (type(obj1) === "Array") {  // find matching element by id or index, invoke subtract
		resultArr = [];
		each(obj1, function (i, ele1) {
			var matchingElement2;

			if (ele1.id !== undefined) {
				matchingElement2 = find(obj2, function (j, ele2) {
					return ele2.id === ele1.id;
				});
			}
			else if (i < obj2.length) {
				matchingElement2 = obj2[i];
			}
			else {
				matchingElement2 = undefined;
			}

			result = self.subtract(ele1, matchingElement2);

			if (result !== undefined) {
				resultArr.push(result);
			}
		});

		return resultArr;
	}
	else if (obj1 === obj2) {  // comparable and equal, should wipe out
		return undefined;
	}
	else {  // leave object on the left as is
		return obj1;
	}
};

/**
 * Add properties from two objects into one, when obj1 and obj2 have the same property, use value from obj2
 *
 * @memberOf Isa
 * @function
 * @param {object} obj1 The first object
 * @param {object} obj2 The second object
 * @return {object} The object with properties added from both objects
 */
Isa.prototype.add = function (obj1, obj2) {
	var slate,
		property,
		self = this,
		result,
		matchingElement1;

	if (obj1 === undefined) {
		return obj2;
	}

	if (obj2 === undefined ||
		(type(obj2) === "Object" && isEmpty(obj2))) {
		return obj1;
	}

	if (type(obj1) === "Object") {  // invoke add on every property of object
		slate = clone(obj1);

		for (property in obj2) {
			result = self.add(obj1[property], obj2[property]);
			slate[property] = result;
		}
	}
	else if (type(obj1) === "Array") {  // invoke add on matching element or add new
		slate = clone(obj1);

		each(obj2, function (j, ele2) {
			if (type(ele2) === "Object") {
				if (ele2.id !== undefined) {  // find matching element by id
					var matchingElement1Index;

					matchingElement1 = find(obj1, function (i, ele1) {
						if (ele2.id === ele1.id) {
							matchingElement1Index = i;
							return true;
						}

						return false;
					});

					if (matchingElement1 === undefined) {
						slate.push(ele2);
					}
					else {
						result = self.add(matchingElement1, ele2);
						slate[matchingElement1Index] = result;
					}
				}
				else if (j < obj1.length) {  // find matching element by index
					matchingElement1 = obj1[j];
					result = self.add(matchingElement1, ele2);
					slate[j] = result;
				}
			}
			else {  // add element on the right to the array
				slate.push(ele2);
			}
		});
	}
	else {  // no match, add element on the right
		return obj2;
	}

	return slate;
};
