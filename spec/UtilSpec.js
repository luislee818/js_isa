describe("Util", function () {
	describe("arraySubtract()", function () {
		var arr1,
			arr2,
			result,
			expected;

		describe("when subtracting array of non-objects", function () {
			it("should return an array with objects in arr1 but not in arr2", function () {
				arr1 = [1, 2, 3, 4];
				arr2 = [3, 4];
				expected = [1, 2];

				result = Util.arraySubtract(arr1, arr2);

				expect(Util.arraysEqual(expected, result)).toBeTruthy();
			});
		});

		describe("when subtracting array of objects", function () {
			it("should return an array with objects in arr1 but not in arr2, use id as identity", function () {
				arr1 = [
					{ id: 1 },
					{ id: 2 },
					{ id: 3 },
					{ id: 4 }
				];
				arr2 = [
					{ id: 3 },
					{ id: 4 }
				];
				expected = [
					{ id: 1 },
					{ id: 2 }
				];

				result = Util.arraySubtract(arr1, arr2);

				expect(Util.arraysEqual(expected, result)).toBeTruthy();
			});
		});
	});
});
