const missionInsert = async () => {
    const missionTitle = document.getElementById("missionTitle");
    const missionCreator = document.getElementById("missionCreator");

    // alert(missionTitle.value + ":" + missionCreator.value);
    axios.post('/mission/testInsert',
        {
            'company_id': missionTitle.value,
            'company_bnum': missionCreator.value
        })
        .then(res => {
            console.log(res);
        })
}

const missionQuery = async () => {
    const missionCreator = document.getElementById("queryTitle");

    const result = await axios.post('/mission/query',
    {
        'queryName': missionCreator.value
    })

    document.getElementById("queryChange").innerHTML = result.data.creator + result.data.title;
}