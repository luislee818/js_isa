var Isa;

function type(o){
	    return !!o && Object.prototype.toString.call(o).match(/(\w+)\]/)[1];
}

// functions will not be cloned
function clone(o) {
	return JSON.parse(JSON.stringify(o));
}

Isa = function () {};

Isa.prototype.intersect = function(obj1, obj2) {
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

Isa.prototype.subtract = function(obj1, obj2) {
	var slate,
		property;

	if (obj2 === {}) {
		return obj1;
	}

	slate = clone(obj1);

	for (property in obj2) {
		if (slate.hasOwnProperty(property))
		{
			if (type(obj1[property]) !== "Object") {
				delete slate[property];
			}
			else {
				slate[property] = this.subtract(obj1[property], obj2[property]);
			}
		}
	}

	return slate;
};
