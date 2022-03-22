
export const getData = async (id) => {
    return await fetch(`${process.env.REACT_APP_API_URL}/data/` + id)
        .then(resp => resp.json())
        .then(jsondata => {
            return {data: jsondata["data"], id: jsondata["key"]};
        });
}