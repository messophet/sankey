
export const getData = async (id) => {
    return await fetch('http://0.0.0.0:8080/api/data/' + id)
        .then(resp => resp.json())
        .then(jsondata => {
            return {data: jsondata["data"], id: jsondata["key"]};
        });
}