getDate = (d) => {
    var day, month, year;

    result = d.match("[0-9]{2}([\-/ \.])[0-9]{2}[\-/ \.][0-9]{4}");
    if(null != result) {
        dateSplitted = result[0].split(result[1]);
        day = dateSplitted[0];
        month = dateSplitted[1];
        year = dateSplitted[2];
    }
    result = d.match("[0-9]{4}([\-/ \.])[0-9]{2}[\-/ \.][0-9]{2}");
    if(null != result) {
        dateSplitted = result[0].split(result[1]);
        day = dateSplitted[2];
        month = dateSplitted[1];
        year = dateSplitted[0];
    }

    if(month>12) {
        aux = day;
        day = month;
        month = aux;
    }

    return year+"-"+month+"-"+day;
}