import cityList from '../libs/CityData';

let filter = pCode => {
    let arr = [];
    for (const key in cityList) {
        if (cityList.hasOwnProperty(key)) {
            const item = cityList[key];
            if (item[1] === pCode) {
                arr.push({ value: key, label: item[0] });
            }
        }
    }
    console.log(arr);
    return arr;
};

let address = pCode => {
    return pCode &&
    cityList[pCode] &&
    cityList[pCode].length &&
    cityList[pCode].length > 0
        ? cityList[pCode][0]
        : '';
};

export default {
    filter,
    address
};
